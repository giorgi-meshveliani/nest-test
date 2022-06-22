import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  private ALLOWED_HOST = 'localhost:3000';
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['host'] !== this.ALLOWED_HOST) {
      throw new HttpException('invalid host', HttpStatus.FORBIDDEN);
    }
    next();
  }
}
