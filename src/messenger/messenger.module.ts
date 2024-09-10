import { Module } from '@nestjs/common';
import { MessengerService } from './services/messenger.service';
import { MessengerController } from './controllers/messenger.controller';
import { TwilioProvider } from './providers/twilio.provider';

@Module({
        providers: [MessengerService, TwilioProvider],
        controllers: [MessengerController],
})
export class MessengerModule {}
