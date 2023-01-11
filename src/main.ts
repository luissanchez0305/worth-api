import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  app = app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  const hostPort = parseInt(process.env.PORT) || 8080;
  await app.listen(hostPort);
}

bootstrap();
