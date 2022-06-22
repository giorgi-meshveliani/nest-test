import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouletteModule } from './roulette/roulette.module';
import { AppMiddleware } from './app.middleware';

@Module({
  imports: [ConfigModule.forRoot({}), RouletteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppMiddleware)
      .forRoutes(
        { path: 'spin', method: RequestMethod.PATCH },
        { path: 'create', method: RequestMethod.POST },
        { path: 'end', method: RequestMethod.DELETE },
      );
  }
}
