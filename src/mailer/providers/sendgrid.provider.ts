import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendgrid from '@sendgrid/mail';
import { _throwOrContinue } from 'src/utils/helper';
import { IMailerProvider, MailParameter } from '../@types/interfaces';

@Injectable()
export class SendgridProvider implements IMailerProvider {
        private readonly logger = new Logger(SendgridProvider.name);
        private sendgrid: sendgrid.MailService;

        constructor(private config: ConfigService) {
                this.sendgrid = sendgrid;
                this.sendgrid.setApiKey(
                        this.config.get<string>('mailer.sendgrid.apiKey')
                );
        }

        async send(mail: MailParameter, retries = 2): Promise<boolean> {
                try {
                        //@ts-ignore
                        const sent = await this.sendgrid.send(mail);
                        return sent ? true : false;
                } catch (error) {
                        this.logger.error('Failed to send email', error);
                        _throwOrContinue(error, retries);
                        await this.send(mail, retries - 1);
                }
        }
}
