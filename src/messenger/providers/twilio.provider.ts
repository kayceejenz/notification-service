import { Injectable, Logger } from '@nestjs/common';
import * as twilio from 'twilio';
import { ConfigService } from '@nestjs/config';
import { IMessengerProvider, SMSParameter } from '../@types/interfaces';

@Injectable()
export class TwilioProvider implements IMessengerProvider {
        private readonly logger = new Logger(TwilioProvider.name);
        twilio: twilio.Twilio;

        constructor(private readonly config: ConfigService) {
                const { accountSid, authToken } = this.config.get<{
                        accountSid: string;
                        authToken: string;
                }>('messenger.twilio');

                this.twilio = twilio(accountSid, authToken, {
                        autoRetry: true,
                        maxRetries: 3,
                });
        }

        async send(sms: SMSParameter): Promise<boolean> {
                try {
                        const sent = await this.twilio.messages.create(sms);
                        return sent.sid ? true : false;
                } catch (error) {
                        this.logger.error('Failed to send SMS', error);
                }
        }
}
