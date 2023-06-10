import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { INestMicroservice } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  let app: INestMicroservice = await NestFactory.createMicroservice(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  const options = {
    transport: Transport.KAFKA,
    options: {
      ...config.get('app'),
    },
  };
  app = await NestFactory.createMicroservice(AppModule, options);

  await app.listen();
}
bootstrap();
