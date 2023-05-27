import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TokenCronService } from './token-cron.service';
import { StatisticViewsCronService } from './statistic-views-cron.service';
import { HttpModule } from '@nestjs/axios';

import { CurrencyConverterCronService } from './currency-converter-cron.service';
import { CurrencyConverterModule } from '../service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    CurrencyConverterModule,
  ],
  providers: [
    TokenCronService,
    StatisticViewsCronService,
    CurrencyConverterCronService,
  ],
})
export class CronModule {}
