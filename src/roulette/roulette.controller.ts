import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Headers,
  Post,
  Req,
  Session,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { RouletteService } from './roulette.service';
import { NewGameDto } from './dto/new-game.dto';
import { SpinDto } from './dto/spin.dto';
import { BalanceDto } from './dto/balance.dto';

@Controller()
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  private secret = process.env.JWT_SECRET;

  @Get('/balance')
  getBalanceToken(@Req() request: Request) {
    const token = jwt.sign({ balance: 100 }, this.secret, {
      expiresIn: '2h',
    });
    return token;
  }

  @UsePipes(new ValidationPipe({}))
  @Post('/create')
  async createNewGameSession(
    @Session() session: Record<string, any>,
    @Body() body: NewGameDto,
    @Headers('balance') balance: BalanceDto,
  ) {
    return await this.rouletteService.createNewGameSession(
      session,
      body,
      balance,
    );
  }

  @UsePipes(new ValidationPipe())
  @Patch('/spin')
  getBets(@Session() session: Record<string, any>, @Body() spin: SpinDto) {
    return this.rouletteService.receiveBets(session, spin);
  }

  @Delete('/end')
  endGameSession(@Session() session: Record<string, any>) {
    return this.rouletteService.endGameSession(session);
  }
}
