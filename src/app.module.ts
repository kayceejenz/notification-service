import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvironment } from './configs/env.config';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { MessengerModule } from './messenger/messenger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: getEnvironment(),
      isGlobal: true,
      cache: true,
    }),
    MailerModule,
    MessengerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
