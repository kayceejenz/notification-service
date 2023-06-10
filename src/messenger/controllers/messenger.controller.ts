import { Controller } from '@nestjs/common';
import { SMSParameter } from 'src/@types/interfaces';
import { MessengerService } from '../services/messenger.service';
import { EventPattern } from '@nestjs/microservices';

@Controller('messenger')
export class MessengerController {
  constructor(private messengerService: MessengerService) {}

  @EventPattern('send.sms.otp')
  async sendOTP({ to, code }: { to: string; code: string }) {
    const sms: SMSParameter = {
      to,
      body: `Tastyble Authentication code: ${code}`,
    };
    this.messengerService.send(sms);
  }
}
