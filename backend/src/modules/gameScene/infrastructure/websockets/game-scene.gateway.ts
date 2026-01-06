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
import { CommandBus } from '@nestjs/cqrs';
import {
  AddSceneObjectCommand,
  ModifySceneObjectCommand,
  DeleteSceneObjectCommand,
} from '../../application/commands/impl/scene-object.commands';

@WebSocketGateway({
  namespace: '/ws/game-scenes',
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
    if (sceneId) {
      client.join(sceneId);
    }
  }

  handleDisconnect(client: Socket) {
    // Rooms are automatically left on disconnect
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
    @MessageBody() data: { sceneId: string; layerId: string; objectId: string; payload: any },
    @ConnectedSocket() client: Socket,
  ) {
    await this.commandBus.execute(new ModifySceneObjectCommand(data.sceneId, data.layerId, data.objectId, data.payload));

    client.to(data.sceneId).emit('objectModified', {
      sceneId: data.sceneId,
      layerId: data.layerId,
      objectId: data.objectId,
      payload: data.payload,
    });
  }

  @SubscribeMessage('deleteObject')
  async handleDeleteObject(@MessageBody() data: { sceneId: string; layerId: string; objectId: string }, @ConnectedSocket() client: Socket) {
    await this.commandBus.execute(new DeleteSceneObjectCommand(data.sceneId, data.layerId, data.objectId));

    client.to(data.sceneId).emit('objectDeleted', {
      sceneId: data.sceneId,
      layerId: data.layerId,
      objectId: data.objectId,
    });
  }
}
