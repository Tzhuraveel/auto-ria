import { Module } from '@nestjs/common';
import { FilterProfanityService } from './filterProfanity.service';
import { HttpModule } from '@nestjs/axios';
import { MailModule } from '../mail';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    MailModule,
  ],
  providers: [FilterProfanityService],
  exports: [FilterProfanityService],
})
export class FilterProfanityModule {}
