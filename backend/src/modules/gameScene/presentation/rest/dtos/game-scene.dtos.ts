import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { GridMetricSystem, GridType } from '../../../domain/aggregates/game-scene.types';

export class CreateGameSceneDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  gameId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(1)
  stageWidth?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(1)
  stageHeight?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @ApiPropertyOptional({ enum: GridType })
  @IsEnum(GridType)
  @IsOptional()
  gridType?: GridType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(1)
  gridCellSize?: number;

  @ApiPropertyOptional({ enum: GridMetricSystem })
  @IsEnum(GridMetricSystem)
  @IsOptional()
  gridMetricSystem?: GridMetricSystem;
}

export class UpdateGameSceneDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(1)
  stageWidth?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(1)
  stageHeight?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @ApiPropertyOptional({ enum: GridType })
  @IsEnum(GridType)
  @IsOptional()
  gridType?: GridType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(1)
  gridCellSize?: number;

  @ApiPropertyOptional({ enum: GridMetricSystem })
  @IsEnum(GridMetricSystem)
  @IsOptional()
  gridMetricSystem?: GridMetricSystem;
}

export class CreateSceneLayerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  isLocked?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  isVisible?: boolean;
}

export class UpdateSceneLayerDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isLocked?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  isVisible?: boolean;
}
