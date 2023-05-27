import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../orm';
import { ITokenPayload } from '../interface';
import { EDbField, EDynamicallyAction } from '../enum';
import { CommonService } from '../common';
import { UserStatus } from '@prisma/client';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly commonService: CommonService,
  ) {
    super();
  }

  async validate(token): Promise<any> {
    const tokenFromBd = await this.prismaService.accessToken.findFirst({
      where: { accessToken: token },
    });

    if (!tokenFromBd) {
      throw new HttpException('Token not found', 400);
    }

    const payload = this.jwtService.verify(token) as ITokenPayload;

    const user = await this.commonService.checkIsUserExist(
      EDynamicallyAction.NEXT,
      payload.id,
      EDbField.ID,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.status === UserStatus.BANNED) {
      throw new HttpException('This user is banned', HttpStatus.FORBIDDEN);
    }

    if (payload.role !== user.role) {
      throw new ForbiddenException();
    }

    return user;
  }
}
