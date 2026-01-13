import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ForeignKey } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { GameSceneLayerEntity } from './game-scene-layer.entity';
import { GridMetricSystem, GridType } from '../../../../domain/aggregates/game-scene.types';
import { GameEntity } from '../../../../../game/infrastructure/persistence/entities/game.entity';

@Entity('game_scenes')
export class GameSceneEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Living Room' })
  @Column()
  name: string;

  @ApiProperty({ type: Object })
  @Column({ type: 'jsonb', nullable: false })
  stageJSON: object;

  @ApiProperty({ example: 800 })
  @Column('int')
  stageWidth: number;

  @ApiProperty({ example: 600 })
  @Column('int')
  stageHeight: number;

  @ApiProperty({ example: '#ffffff' })
  @Column()
  backgroundColor: string;

  @ApiProperty({ enum: GridType, default: GridType.SQUARE })
  @Column({
    type: 'enum',
    enum: GridType,
    default: GridType.SQUARE,
  })
  gridType: GridType;

  @ApiProperty({ example: 70, default: 70 })
  @Column('int', { default: 70 })
  gridCellSize: number;

  @ApiProperty({ enum: GridMetricSystem, default: GridMetricSystem.SQUARES })
  @Column({
    type: 'enum',
    enum: GridMetricSystem,
    default: GridMetricSystem.SQUARES,
  })
  gridMetricSystem: GridMetricSystem;

  @ApiProperty({ default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ type: () => GameSceneLayerEntity, isArray: true })
  @OneToMany(() => GameSceneLayerEntity, (layer) => layer.scene, { cascade: true, eager: true })
  layers: GameSceneLayerEntity[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: 1 })
  @Column({ type: 'integer', nullable: false })
  @ForeignKey(() => GameEntity, { onDelete: 'CASCADE' })
  gameId: number;
}
