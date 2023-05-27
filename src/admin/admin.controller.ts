import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { BearerGuard, RolesAccess, RolesGuard } from '../core';
import { ManagerDto } from './dto/admin.dto';
import { Roles } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

ApiTags('admin');
@UseGuards(BearerGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @RolesAccess(Roles.ADMIN)
  @ApiOperation({
    description: 'Only admin can use this endpoint',
    summary: 'create manager',
  })
  @Post('create-manager')
  private async createManager(@Body() body: ManagerDto, @Res() res) {
    await this.adminService.createManager(body);

    res.status(HttpStatus.CREATED).sendStatus(HttpStatus);
  }
}
