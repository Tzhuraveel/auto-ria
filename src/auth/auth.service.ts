import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';
import { Roles, Status, UserStatus } from '@prisma/client';

import {
  CommonService,
  EDbField,
  EDynamicallyAction,
  EEmailAction,
  EmailService,
  PasswordService,
  PrismaService,
} from '../core';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  public async validateRequest({ token }): Promise<string> {
    if (!token) {
      throw new HttpException('Token expired or deleted', 400);
    }

    const tokenFromDb = await this.prismaService.emailToken.findFirst({
      where: { token },
    });

    if (!tokenFromDb) {
      throw new HttpException('Token is deleted or expired', 400);
    }

    return tokenFromDb.emailUser;
  }

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly passwordService: PasswordService,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  public async sendMail(email: string): Promise<void> {
    await this.commonService.checkIsUserExist(
      EDynamicallyAction.THROW,
      email,
      EDbField.EMAIL,
    );

    const token = otpGenerator.generate(10, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const tokenFromDb = await this.prismaService.emailToken.findFirst({
      where: { emailUser: email },
    });

    if (tokenFromDb) {
      await this.prismaService.emailToken.deleteMany({
        where: { token: tokenFromDb.token },
      });
    }

    await Promise.all([
      this.prismaService.emailToken.create({
        data: { token: token, emailUser: email },
      }),
      this.emailService.sendMail(email, EEmailAction.REGISTER, { token }),
    ]);
  }

  public async getDataByToken(token: string): Promise<object> {
    const data = await this.prismaService.emailToken.findFirst({
      where: { token },
    });

    if (!data) {
      throw new HttpException(
        'Token expired or deleted',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { email: data.emailUser };
  }

  public async register(
    user: RegisterDto,
    token: string,
    userEmail: string,
  ): Promise<void> {
    await this.prismaService.emailToken.deleteMany({ where: { token } });

    if (user.email !== userEmail) {
      throw new HttpException('Token does not belong to this user', 400);
    }

    await this.commonService.checkIsUserExist(
      EDynamicallyAction.THROW,
      user.email,
      EDbField.EMAIL,
    );

    const hashedPassword = await this.passwordService.hash(user.password);

    await this.prismaService.user.create({
      data: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        password: hashedPassword,
        role: user.isBuyer ? Roles.BUYER : Roles.SELLER,
      },
    });
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.commonService.checkIsUserExist(
      EDynamicallyAction.NEXT,
      email,
      EDbField.EMAIL,
    );

    if (user.status === UserStatus.BANNED) {
      throw new HttpException('This user is banned', HttpStatus.FORBIDDEN);
    }

    await this.passwordService.compare(password, user.password);

    const token = await this.jwtService.signAsync({
      role: user.role,
      id: user.id,
    });

    await this.prismaService.accessToken.create({
      data: { accessToken: token, userId: user.id },
    });

    return token;
  }
}
