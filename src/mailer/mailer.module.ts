import { Module } from '@nestjs/common';
import { MailerService } from './services/mailer.service';
import { MailerController } from './controllers/mailer.controller';
import { SendgridProvider } from './providers/sendgrid.provider';

@Module({
  providers: [MailerService, SendgridProvider],
  controllers: [MailerController],
})
export class MailerModule {}
