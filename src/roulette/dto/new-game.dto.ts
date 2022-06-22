import { IsIn, IsInt, IsNotEmpty, ValidateIf } from 'class-validator';

export class NewGameDto {
  @IsNotEmpty()
  @IsIn(['normal', 'testing'])
  gameMode: string;

  @ValidateIf((o) => o.gameMode === 'testing')
  @IsNotEmpty({
    message: 'balance must be defined in body in case gameMode is testing',
  })
  @IsInt()
  balance: number;
}
