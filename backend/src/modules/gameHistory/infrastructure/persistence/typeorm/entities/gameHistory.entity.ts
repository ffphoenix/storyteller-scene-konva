import { Entity, PrimaryColumn, Column, Index, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { GameHistoryType } from '../../../../domain/aggregates/gameHistory.types';

@Entity('game_history')
export class GameHistoryEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty({ enum: GameHistoryType })
  @Column({
    type: 'varchar',
  })
  type: string;

  @ApiProperty({ example: 1 })
  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @ApiProperty({ example: 1 })
  @Column({ name: 'game_id', type: 'integer' })
  @Index()
  gameId: number;

  @ApiProperty({ type: Object })
  @Column({ type: 'jsonb' })
  body: any;

  @ApiProperty()
  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
