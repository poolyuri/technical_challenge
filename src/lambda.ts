import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import { configure } from '@codegenie/serverless-express';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@infrastructure/common/filters/exception.filter';
import { LoggerInterceptor } from '@infrastructure/common/interceptors/logger.interceptor';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { Result } from '@core';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
    }),
  );

  // filters
  app.useGlobalFilters(new HttpExceptionFilter(new LoggerService()));

  // interceptors
  app.useGlobalInterceptors(new LoggerInterceptor(new LoggerService()));

  // swagger config
  if (process.env.NODE_ENV !== 'production') {
    const swgDesc = `This project with NestJs shows what it would be like to work with a 
      Clean Architecture and Domain-Driven Design (DDD).`;

    const config = new DocumentBuilder()
      .setTitle('NestJS API - OpenAPI 3.0')
      .setDescription(swgDesc)
      .setVersion('1.0')
      .setExternalDoc(
        'Technical Challenge - Pool Yurivilca',
        'https://github.com/poolyuri/technical_challenge',
      )
      .addTag('API')
      .addServer(`/${process.env.NODE_ENV || 'development'}`)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Input your JWT token',
          name: 'Authorization',
          in: 'header',
        },
        'bearer',
      )
      .setContact('the developer', '', 'poolyuri@gmail.com')
      .build();

    SwaggerModule.setup(
      'api',
      app,
      () =>
        SwaggerModule.createDocument(app, config, {
          extraModels: [Result],
        }),
      {
        swaggerOptions: {
          security: [{ bearer: [] }],
        },
      },
    );
  }

  app.enableCors();

  await app.init();

  const expressHandler = app.getHttpAdapter().getInstance();

  return configure({ app: expressHandler });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
