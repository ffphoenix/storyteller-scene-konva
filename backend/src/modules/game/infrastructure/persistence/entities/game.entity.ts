import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GameStatus } from '../../../domain/aggregates/game-status.enum';

@Entity('games')
export class GameEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unique: true, length: 8 })
  @Index({ unique: true })
  shortUrl: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.CREATED,
  })
  status: GameStatus;

  @Column()
  ownerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
