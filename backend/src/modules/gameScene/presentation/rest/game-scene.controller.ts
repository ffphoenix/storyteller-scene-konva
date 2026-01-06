import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateGameSceneDto, UpdateGameSceneDto, CreateSceneLayerDto, UpdateSceneLayerDto } from './dtos/game-scene.dtos';
import {
  CreateGameSceneCommand,
  UpdateGameSceneCommand,
  DeleteGameSceneCommand,
} from '../../application/commands/impl/game-scene.commands';
import {
  CreateSceneLayerCommand,
  UpdateSceneLayerCommand,
  DeleteSceneLayerCommand,
} from '../../application/commands/impl/scene-layer.commands';
import { GetGameScenesQuery, GetGameSceneByIdQuery, GetSceneLayersQuery } from '../../application/queries/impl/game-scene.queries';
import { JwtAuthGuard } from '../../../account/auth/guards/jwt-auth.guard';

@ApiTags('game-scenes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/game-scenes')
export class GameSceneController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game scene' })
  @ApiResponse({ status: 201, description: 'The scene has been successfully created.' })
  async create(@Body() dto: CreateGameSceneDto) {
    return this.commandBus.execute(
      new CreateGameSceneCommand(
        dto.name,
        dto.stageWidth,
        dto.stageHeight,
        dto.backgroundColor,
        dto.gridType,
        dto.gridCellSize,
        dto.gridMetricSystem,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of game scenes' })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.queryBus.execute(new GetGameScenesQuery(Number(page), Number(limit)));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full scene by id' })
  async findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetGameSceneByIdQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update scene metadata and grid settings' })
  async update(@Param('id') id: string, @Body() dto: UpdateGameSceneDto) {
    return this.commandBus.execute(
      new UpdateGameSceneCommand(
        id,
        dto.name,
        dto.stageWidth,
        dto.stageHeight,
        dto.backgroundColor,
        dto.gridType,
        dto.gridCellSize,
        dto.gridMetricSystem,
      ),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a scene' })
  async delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteGameSceneCommand(id));
  }

  @Post(':sceneId/layers')
  @ApiOperation({ summary: 'Create a new layer in a scene' })
  async createLayer(@Param('sceneId') sceneId: string, @Body() dto: CreateSceneLayerDto) {
    return this.commandBus.execute(new CreateSceneLayerCommand(sceneId, dto.name, dto.isLocked, dto.isVisible));
  }

  @Get(':sceneId/layers')
  @ApiOperation({ summary: 'List layers for a scene' })
  async findLayers(@Param('sceneId') sceneId: string) {
    return this.queryBus.execute(new GetSceneLayersQuery(sceneId));
  }

  @Patch(':sceneId/layers/:layerId')
  @ApiOperation({ summary: 'Update layer' })
  async updateLayer(@Param('sceneId') sceneId: string, @Param('layerId') layerId: string, @Body() dto: UpdateSceneLayerDto) {
    return this.commandBus.execute(new UpdateSceneLayerCommand(sceneId, layerId, dto.name, dto.isLocked, dto.isVisible));
  }

  @Delete(':sceneId/layers/:layerId')
  @ApiOperation({ summary: 'Delete layer' })
  async deleteLayer(@Param('sceneId') sceneId: string, @Param('layerId') layerId: string) {
    return this.commandBus.execute(new DeleteSceneLayerCommand(sceneId, layerId));
  }
}
