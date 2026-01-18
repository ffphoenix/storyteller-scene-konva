import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsObject, IsNumber } from 'class-validator';
import { GameHistoryType } from '../../../domain/aggregates/gameHistory.types';

export class CreateGameHistoryItemDto {
  @ApiProperty({ enum: GameHistoryType, example: GameHistoryType.DICE_ROLL })
  @IsEnum(GameHistoryType)
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: { message: '1d20' } })
  @IsObject()
  @IsNotEmpty()
  body: any;
}
