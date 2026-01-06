import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GameSceneEntity } from './game-scene.entity';

@Entity('game_scene_layers')
export class GameSceneLayerEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ default: true })
  isVisible: boolean;

  @Column('int')
  order: number;

  @ManyToOne(() => GameSceneEntity, (scene) => scene.layers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sceneId' })
  scene: GameSceneEntity;

  @Column()
  sceneId: string;
}
