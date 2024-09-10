import { Injectable } from '@nestjs/common';
import { SendgridProvider } from '../providers/sendgrid.provider';
import { ConfigService } from '@nestjs/config';
import {
        IMailerProvider,
        MailParameter,
        MailProvider,
} from '../@types/interfaces';
import { MailgunProvider } from '../providers/mailgun.provider';

@Injectable()
export class MailerService {
        constructor(
                private readonly sendgridProvider: SendgridProvider,
                private readonly mailgunProvider: MailgunProvider,
                private readonly config: ConfigService
        ) {}

        private getMailProvider(provider: string): IMailerProvider {
                switch (provider) {
                        case MailProvider.SENDGRID:
                                return this.sendgridProvider;
                        case MailProvider.MAILGUN:
                                this.mailgunProvider;
                        default:
                                throw new Error(
                                        `[Unsupported]: Mail provider: ${provider} not supported`
                                );
                }
        }

        async send(parameters: MailParameter) {
                const provider = this.config.get<string>(
                        'mailer.provider',
                        'sendgrid'
                );
                const mailer = this.getMailProvider(provider);
                const mail: MailParameter = {
                        from: {
                                ...this.config.get<{
                                        name: string;
                                        email: string;
                                }>('mailer.sender'),
                        },
                        ...parameters,
                };
                return await mailer.send(mail);
        }
}
