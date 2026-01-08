import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { GameSceneLayerEntity } from './game-scene-layer.entity';
import { GridMetricSystem, GridType } from '../../../../domain/aggregates/game-scene.types';
import { GameEntity } from '../../../../../game/infrastructure/persistence/entities/game.entity';

@Entity('game_scenes')
export class GameSceneEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('int')
  gameId: number;

  @ManyToOne(() => GameEntity)
  @JoinColumn({ name: 'gameId' })
  game: GameEntity;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: false })
  stageJSON: object;

  @Column('int')
  stageWidth: number;

  @Column('int')
  stageHeight: number;

  @Column()
  backgroundColor: string;

  @Column({
    type: 'enum',
    enum: GridType,
    default: GridType.SQUARE,
  })
  gridType: GridType;

  @Column('int', { default: 70 })
  gridCellSize: number;

  @Column({
    type: 'enum',
    enum: GridMetricSystem,
    default: GridMetricSystem.SQUARES,
  })
  gridMetricSystem: GridMetricSystem;

  @OneToMany(() => GameSceneLayerEntity, (layer) => layer.scene, { cascade: true, eager: true })
  layers: GameSceneLayerEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
