import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { IMessengerProvider, SMSParameter } from 'src/@types/interfaces';
import { _throwOrContinue } from 'src/utils/helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioProvider implements IMessengerProvider {
  twilio: twilio.Twilio;
  constructor(private readonly config: ConfigService) {
    const accountSid = this.config.get<string>('messenger.twilio.accountSid');
    const authToken = this.config.get<string>('messenger.twilio.authToken');
    this.twilio = twilio(accountSid, authToken, {
      autoRetry: true,
      maxRetries: 3,
    });
  }
  async send(
    sms: SMSParameter & { from: string },
    retries?: number,
  ): Promise<boolean> {
    try {
      console.log('sending sms');
      const sent = await this.twilio.messages.create(sms);
      return sent.sid ? true : false;
    } catch (error) {
      _throwOrContinue(error, retries);
      await this.send(sms, retries - 1);
    }
  }
}
