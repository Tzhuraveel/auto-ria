import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CommonService,
  EDbField,
  EDynamicallyAction,
  PasswordService,
  PrismaService,
} from '../core';
import { ManagerDto } from './dto/admin.dto';
import { Roles } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly commonService: CommonService,
  ) {}

  public async createManager(manager: ManagerDto) {
    const managerFromDb = await this.commonService.checkIsUserExist(
      EDynamicallyAction.THROW,
      manager.email,
      EDbField.EMAIL,
    );

    if (managerFromDb) {
      throw new HttpException('Manager already exist', HttpStatus.OK);
    }

    const hashedPassword = await this.passwordService.hash(manager.password);

    await this.prismaService.user.create({
      data: {
        email: manager.email,
        name: manager.name,
        phone: manager.phone,
        password: hashedPassword,
        role: Roles.MANAGER,
      },
    });
  }
}
