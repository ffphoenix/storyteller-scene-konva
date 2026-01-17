import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsEnum, IsObject } from 'class-validator';
import { GameHistoryType } from '../../../domain/aggregates/gameHistory.types';

export class CreateGameHistoryItemDto {
  @ApiProperty({ enum: GameHistoryType, example: GameHistoryType.DICE_ROLL })
  @IsEnum(GameHistoryType)
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: { x: 10, y: 20 } })
  @IsObject()
  @IsNotEmpty()
  body: any;
}
