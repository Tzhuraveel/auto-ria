import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PasswordModule } from '../core';

@Module({
  imports: [PasswordModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
