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
  const server_port = process.env.YOUR_PORT || process.env.HOST_PORT || 8080;
  const server_host = process.env.YOUR_HOST || '0.0.0.0';
  app.listen(server_port, server_host, () => {
    console.log('Listening on port %d', server_port);
  });
}

bootstrap();
