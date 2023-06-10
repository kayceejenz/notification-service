import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailerProvider, MailParameter } from 'src/@types/interfaces';
import * as sendgrid from '@sendgrid/mail';
import { _throwOrContinue } from 'src/utils/helper';

@Injectable()
export class SendgridProvider implements IMailerProvider {
  private sendgrid: sendgrid.MailService;
  constructor(private config: ConfigService) {
    this.sendgrid = sendgrid;
    this.sendgrid.setApiKey(this.config.get<string>('mailer.sendgrid.apiKey'));
  }
  async send(
    mail: MailParameter & { from: string },
    retries = 2,
  ): Promise<boolean> {
    try {
      const sent = await this.sendgrid.send(mail);
      return sent ? true : false;
    } catch (error) {
      _throwOrContinue(error, retries);
      await this.send(mail, retries - 1);
    }
  }
}
