import { Module } from '@nestjs/common';

import { PasswordService } from './passport.service';

@Module({ providers: [PasswordService], exports: [PasswordService] })
export class PasswordModule {}
