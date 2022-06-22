import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BetDto } from './dto/bet.dto';
import { SpinDto } from './dto/spin.dto';
import { NewGameDto } from './dto/new-game.dto';

const GAME_MODE = {
  NORMAL: 'normal',
  TEST: 'testing',
};

const COEFFICIENTS = {
  NUMBER: 36,
  ODD_OR_EVEN: 2,
};

const BET_TYPE = {
  ODD: 'odd',
  EVEN: 'even',
};

@Injectable()
export class RouletteService {
  private jwtSecret = process.env.JWT_SECRET;

  getBalance(token: string | string[]): any {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded.balance;
    } catch (error) {
      Logger.log(error.message);
      throw new HttpException(
        `Can not verified your balance. error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createNewGameSession(
    session: Record<string, any>,
    body: NewGameDto,
    jwtToken,
  ) {
    const { gameMode } = body;
    let { balance } = body;
    if (gameMode === GAME_MODE.NORMAL) {
      balance = this.getBalance(jwtToken);
    }
    session.gameMode = gameMode;
    session.startBalance = balance;
    session.currentBalance = balance;
    return 'Created new Game.';
  }

  private determineWinSum(randomNumber: number, bets: BetDto[]) {
    const wonBets: BetDto[] = [];
    let wonAmount = 0;
    const isOdd = randomNumber % 2 === 1;
    for (const bet of bets) {
      if (randomNumber === bet.betType) {
        wonAmount += bet.betAmount * COEFFICIENTS.NUMBER;
        wonBets.push(bet);
      } else {
        if (
          (isOdd && bet.betType === BET_TYPE.ODD) ||
          (!isOdd && bet.betType === BET_TYPE.EVEN)
        ) {
          wonAmount += COEFFICIENTS.ODD_OR_EVEN * bet.betAmount;
          wonBets.push(bet);
        }
      }
    }
    return {
      wonAmount,
      wonBets,
    };
  }

  receiveBets(session: Record<string, any>, spin: SpinDto) {
    let currentBalance = session.currentBalance;
    const bets = spin.betInfo;
    let winningNumber = spin.winningNumber;
    const allBetsAmount = bets.reduce((total, bet) => {
      return total + bet.betAmount;
    }, 0);
    if (currentBalance < allBetsAmount) {
      throw new HttpException(
        'Your balance in not enough to do all the bets.',
        HttpStatus.BAD_REQUEST,
      );
    }
    currentBalance -= allBetsAmount;
    const gameMode = session.gameMode;
    if (
      gameMode === GAME_MODE.NORMAL ||
      (gameMode === GAME_MODE.TEST && !winningNumber)
    ) {
      const randomNumber = Math.floor(Math.random() * 36);
      winningNumber = randomNumber;
    }
    const result = this.determineWinSum(winningNumber, bets);
    currentBalance += result.wonAmount;
    session.currentBalance = currentBalance;
    return {
      currentBalance,
      wonBets: result.wonBets,
    };
  }

  endGameSession(session: Record<string, any>) {
    const result = {
      startBalance: session.startBalance,
      endBalance: session.currentBalance,
    };
    session.destroy();
    return result;
  }
}
