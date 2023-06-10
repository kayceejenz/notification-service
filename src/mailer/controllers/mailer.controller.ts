import { Controller } from '@nestjs/common';
import { MailerService } from '../services/mailer.service';
import { EventPattern } from '@nestjs/microservices';
import { MailParameter } from 'src/@types/interfaces';

@Controller('mailer')
export class MailerController {
  constructor(private mailerService: MailerService) {}

  @EventPattern('send.email.otp')
  async sendOTP({ to, code }: { to: string; code: string }) {
    const mail: MailParameter = {
      to,
      subject: 'OTP Code',
      text: `Tastyble Authentication code: ${code}`,
    };
    this.mailerService.send(mail);
  }
}
