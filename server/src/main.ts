import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { LogLevel } from "@nestjs/common/services/logger.service";


const PORT = 8000

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

  function loggerMode(mode: "warning" | "full" = "warning") {
    const logger: LogLevel[] = ["warn", "error", "fatal", "verbose", "debug"]
    if (mode === "full") logger.push("log")
    return logger
  }

  const app = await NestFactory.create(AppModule, { logger: loggerMode("warning") });
  app.enableCors({ credentials: true, origin: ["https://127.0.0.1:3000"] })
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT, () => console.log(`NEST APP STARTED ON ${PORT} PORT`));
}

bootstrap();
