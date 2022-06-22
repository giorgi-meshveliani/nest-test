import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as createRedisStore from 'connect-redis';
import * as session from 'express-session';
import { createClient } from 'redis';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const port = process.env.PORT || 3000;
  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  });

  redisClient.on('error', (err) =>
    Logger.error('Could not establish a connection with redis. ' + err),
  );
  redisClient.on('connect', () =>
    Logger.verbose('Connected to redis successfully'),
  );
  app.use(
    session({
      store: new RedisStore({ client: redisClient as any }),
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(port);
}

bootstrap();
