import { Controller } from '@nestjs/common';
import { MessengerService } from '../services/messenger.service';
import { EventPattern } from '@nestjs/microservices';
import { SMSParameter } from '../@types/interfaces';

@Controller('messenger')
export class MessengerController {
        constructor(private messengerService: MessengerService) {}

        @EventPattern('send.sms')
        async sendOTP(payload: SMSParameter) {
                this.messengerService.send(payload);
        }
}
