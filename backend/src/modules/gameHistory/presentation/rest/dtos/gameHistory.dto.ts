import { ApiProperty } from '@nestjs/swagger';
import { GameHistoryType } from '../../../domain/aggregates/gameHistory.types';

export class GameHistoryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ enum: GameHistoryType })
  type: string;

  @ApiProperty({ example: 'user-123' })
  userId: string;

  @ApiProperty({ example: 1 })
  gameId: number;

  @ApiProperty()
  body: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date | null;
}
