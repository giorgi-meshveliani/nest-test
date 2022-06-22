import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouletteController } from './roulette.controller';
import { RouletteService } from './roulette.service';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [RouletteController],
  providers: [RouletteService],
})
export class RouletteModule {}
