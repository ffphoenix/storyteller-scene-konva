import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AddSceneObjectCommand } from '../../application/commands/impl/add-scene-object.command';
import { ModifySceneObjectCommand } from '../../application/commands/impl/modify-scene-object.command';
import { DeleteSceneObjectCommand } from '../../application/commands/impl/delete-scene-object.command';
import { CommandBus } from '@nestjs/cqrs';
import { KonvaNode } from '../../domain/aggregates/game-scene.aggregate';

@WebSocketGateway({
  namespace: '/game-scene',
  cors: {
    origin: '*',
  },
})
export class GameSceneGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commandBus: CommandBus) {}

  handleConnection(client: Socket) {
    const sceneId = client.handshake.query.sceneId as string;
    console.log(`Client connected to scene ${sceneId}`, client.handshake.query);
    if (sceneId) {
      client.join(sceneId);
    }
  }

  handleDisconnect(client: Socket) {
    // Rooms are automatically left on disconnect
  }

  @SubscribeMessage('joinScene')
  async handleJoinScene(@MessageBody() sceneId: string, @ConnectedSocket() client: Socket) {
    console.log(`Client joined scene ${sceneId}`);
    client.join(sceneId);
  }

  @SubscribeMessage('addObject')
  async handleAddObject(
    @MessageBody() data: { sceneId: string; layerId: string; objectId: string; payload: any },
    @ConnectedSocket() client: Socket,
  ) {
    await this.commandBus.execute(new AddSceneObjectCommand(data.sceneId, data.layerId, data.objectId, data.payload));

    // Broadcast to others in the same room
    client.to(data.sceneId).emit('objectAdded', {
      sceneId: data.sceneId,
      layerId: data.layerId,
      objectId: data.objectId,
      payload: data.payload,
    });
  }

  @SubscribeMessage('modifyObject')
  async handleModifyObject(
    @MessageBody()
    data: {
      sceneId: string;
      layerId: string;
      payload: KonvaNode[];
      currentGroupProps: Partial<KonvaNode>;
      originalGroupProps: Partial<KonvaNode>;
    },
    @ConnectedSocket() client: Socket,
  ) {
    await this.commandBus.execute(new ModifySceneObjectCommand(data.sceneId, data.layerId, data.payload));

    client.to(data.sceneId).emit('objectModified', {
      sceneId: data.sceneId,
      layerId: data.layerId,
      payload: data.payload,
      currentGroupProps: data.currentGroupProps,
      originalGroupProps: data.originalGroupProps,
    });
  }

  @SubscribeMessage('deleteObject')
  async handleDeleteObject(
    @MessageBody() data: { sceneId: string; layerId: string; payload: KonvaNode[] },
    @ConnectedSocket() client: Socket,
  ) {
    await this.commandBus.execute(new DeleteSceneObjectCommand(data.sceneId, data.layerId, data.payload));

    client.to(data.sceneId).emit('objectDeleted', {
      sceneId: data.sceneId,
      layerId: data.layerId,
      payload: data.payload,
    });
  }
}
