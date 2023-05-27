import * as path from 'node:path';
import * as process from 'process';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './mail.service';

@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp-relay.sendinblue.com',
        secure: false,
        auth: {
          user: 'timofiyzhuravel2003@gmail.com',
          pass: '08AzcVKqMrQpbFXH',
        },
      },
      defaults: {
        from: '"No Reply" <traveler@nestjs.com>',
      },
      template: {
        dir: path.join(process.cwd(), 'template'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports: [EmailService],
})
export class MailModule {}
