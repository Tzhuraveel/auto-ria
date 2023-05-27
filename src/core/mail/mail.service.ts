import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EEmailAction } from '../enum';
import { emailTemplates } from './email.template';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  public async sendMail(
    email: string,
    emailAction: EEmailAction,
    templateData?: object,
  ) {
    try {
      const chosenEmailTemplate = emailTemplates[emailAction];

      return await this.mailService.sendMail({
        to: email,
        subject: chosenEmailTemplate.subject,
        template: chosenEmailTemplate.templateName,
        context: templateData,
      });
    } catch (e) {
      console.error(e);
    }
  }
}
