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
import { CreateGameHistoryItemCommand } from '../../application/commands/impl/createGameHistoryItem.command';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/game-history',
  cors: {
    origin: '*',
  },
})
export class GameHistoryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameHistoryGateway.name);

  constructor(private readonly commandBus: CommandBus) {}

  handleConnection(client: Socket) {
    const gameId = client.handshake.query.gameId as string;
    if (gameId) {
      this.logger.log(`Client ${client.id} connected to game history ${gameId}`);
      client.join(`game-${gameId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected from game history`);
  }

  @SubscribeMessage('subscribeToGame')
  async handleSubscribeToGame(@MessageBody() gameId: string, @ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} subscribing to game ${gameId}`);
    client.join(`game-${gameId}`);
  }

  @SubscribeMessage('unsubscribeFromGame')
  async handleUnsubscribeFromGame(@MessageBody() gameId: string, @ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} unsubscribing from game ${gameId}`);
    client.leave(`game-${gameId}`);
  }

  @SubscribeMessage('createHistoryItem')
  async handleCreateHistoryItem(
    @MessageBody() data: { type: string; userId: number; gameId: number; body: any },
    @ConnectedSocket() client: Socket,
  ) {
    await this.commandBus.execute(new CreateGameHistoryItemCommand(data.type, data.userId, data.gameId, data.body));
    // Note: The actual broadcast will be handled by the GameHistoryItemCreatedHandler
    // which reacts to the domain event.
  }

  broadcastHistoryItem(gameId: number, item: any) {
    this.server.to(`game-${gameId}`).emit('historyItemCreated', item);
  }
}
