import { Module } from '@nestjs/common';
import { loadEnvironment } from './configs/env.config';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { MessengerModule } from './messenger/messenger.module';

@Module({
        imports: [
                ConfigModule.forRoot({
                        load: loadEnvironment(),
                        isGlobal: true,
                        cache: true,
                }),
                MailerModule,
                MessengerModule,
        ],
        controllers: [],
        providers: [],
})
export class AppModule {}
