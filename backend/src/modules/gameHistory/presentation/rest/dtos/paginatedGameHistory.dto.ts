import { ApiProperty } from '@nestjs/swagger';
import { GameHistoryDto } from './gameHistory.dto';

export class PaginatedGameHistoryDto {
  @ApiProperty({ type: [GameHistoryDto] })
  items: GameHistoryDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;
}
