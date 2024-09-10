import { Controller } from '@nestjs/common';
import { MailerService } from '../services/mailer.service';
import { EventPattern } from '@nestjs/microservices';
import { MailParameter } from '../@types/interfaces';

@Controller('mailer')
export class MailerController {
        constructor(private mailerService: MailerService) {}

        @EventPattern('send.email')
        async sendOTP(payload: MailParameter) {
                await this.mailerService.send(payload);
        }
}
