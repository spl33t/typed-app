import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 8000

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const data = exception.getResponse();


    response
      .status(statusCode)
      .json({
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        data
      });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {    logger: ["warn", "error", "fatal", "verbose", "debug"]});
  app.enableCors({ credentials: true, origin: ["https://127.0.0.1:3000"] })
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT, () => console.log(`NEST APP STARTED ON ${PORT} PORT`));
}

bootstrap();
