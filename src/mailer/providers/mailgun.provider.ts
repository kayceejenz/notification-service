import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailerProvider, MailParameter } from '../@types/interfaces';
import createMailgun from 'mailgun-js';

@Injectable()
export class MailgunProvider implements IMailerProvider {
        private readonly logger = new Logger(MailgunProvider.name);
        private mailgun: any;

        constructor(private config: ConfigService) {
                this.mailgun = createMailgun({
                        apiKey: this.config.get<string>(
                                'mailer.mailgun.apiKey',
                        ),
                        domain: this.config.get<string>(
                                'mailer.mailgun.domain',
                        ),
                        retry: 2,
                        testMode: false,
                });
        }

        async send(mail: MailParameter): Promise<boolean> {
                try {
                        const response = await this.mailgun.post(
                                '/messages',
                                mail,
                        );
                        return !!response;
                } catch (error) {
                        this.logger.error(
                                'Failed to send email via Mailgun',
                                error,
                        );
                }
        }
}
