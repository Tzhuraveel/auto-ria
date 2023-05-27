import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { PrismaModule } from '../orm';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
