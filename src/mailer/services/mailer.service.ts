import { Injectable } from '@nestjs/common';
import { SendgridProvider } from '../providers/sendgrid.provider';
import { ConfigService } from '@nestjs/config';
import {
        IMailerProvider,
        MailParameter,
        MailProvider,
} from '../@types/interfaces';

@Injectable()
export class MailerService {
        constructor(
                private sendgridProvider: SendgridProvider,
                private config: ConfigService,
        ) {}

        private getMailProvider(provider: string): IMailerProvider {
                switch (provider) {
                        case MailProvider.SENDGRID:
                                return this.sendgridProvider;
                        case MailProvider.MAILGUN:
                                throw new Error(
                                        `[Unimplemented]: Mail provider: ${provider} not implemented`,
                                );
                        default:
                                throw new Error(
                                        `[Unsupported]: Mail provider: ${provider} not supported`,
                                );
                }
        }

        async send(parameters: MailParameter) {
                const provider = this.config.get<string>('mailer.provider');
                const mailer = this.getMailProvider(provider);
                const mail: MailParameter = {
                        from: {
                                email: this.config.get<string>(
                                        'mailer.sender.email',
                                ),
                                name: this.config.get<string>(
                                        'mailer.sender.name',
                                ),
                        },
                        ...parameters,
                };
                return await mailer.send(mail);
        }
}
