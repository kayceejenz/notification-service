import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioProvider } from '../providers/twilio.provider';
import {
        IMessengerProvider,
        MessengerProvider,
        SMSParameter,
} from '../@types/interfaces';

@Injectable()
export class MessengerService {
        constructor(
                private readonly config: ConfigService,
                private readonly twilioProvider: TwilioProvider
        ) {}

        private getMessengerProvider(provider: string): IMessengerProvider {
                switch (provider) {
                        case MessengerProvider.TWIILIO:
                                return this.twilioProvider;
                        default:
                                throw new Error(
                                        `[Unsupported]: Messenger provider: ${provider} not supported`
                                );
                }
        }
        async send(parameters: SMSParameter) {
                const provider = this.config.get<string>('messenger.provider');
                const messenger = this.getMessengerProvider(provider);
                const mail: SMSParameter = {
                        from: this.config.get<string>('messenger.sender'),
                        ...parameters,
                };
                return await messenger.send(mail, 0);
        }
}
