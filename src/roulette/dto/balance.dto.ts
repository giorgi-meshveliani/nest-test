import { IsJWT, IsNotEmpty, ValidateIf } from 'class-validator';

export class BalanceDto {
  @IsNotEmpty()
  @IsJWT()
  balance: any;
}
