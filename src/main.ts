import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';

import { AppModule } from './app.module';
import { Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

let cachedServer: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  cachedServer = serverlessExpress({ app: expressApp });

  return cachedServer;
}

export async function handler(event: any, context: Context, callback: any) {
  cachedServer = cachedServer ?? (await bootstrap());
  console.log('wrapper is successfull', event)
  return cachedServer(event, context, callback);
}