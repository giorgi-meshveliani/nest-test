import { BetDto } from './bet.dto';
import {
  IsArray,
  IsDefined,
  IsEmpty,
  IsIn,
  IsInt,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class SpinDto {
  @IsArray({ always: true })
  betInfo: BetDto[];

  @IsDefined()
  @IsInt()
  winningNumber: number;
}
