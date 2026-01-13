import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm';
import { UsersModule } from './modules/account/users/users.module';
import { AuthModule } from './modules/account/auth/auth.module';
import { GameModule } from './modules/game/game.module';
import { MessagingModule } from './modules/massaging/messaging.module';
import { GameSceneModule } from './modules/gameScene/game-scene.module';
import { CqrsModule } from '@nestjs/cqrs';
import KafkaEventPublisher from './modules/massaging/KafkaEventPublisher';
import KafkaCommandPublisher from './modules/massaging/KafkaCommandPublisher';
import { KafkaService } from './modules/massaging/KafkaService';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.get('typeorm');
      },
    }),
    MessagingModule,
    CqrsModule.forRootAsync({
      imports: [MessagingModule],
      inject: [KafkaService],
      useFactory: async (kafkaService: KafkaService) => {
        return {
          eventPublisher: new KafkaEventPublisher(kafkaService),
          commandPublisher: new KafkaCommandPublisher(kafkaService),
        };
      },
    }),
    UsersModule,
    AuthModule,
    GameModule,
    GameSceneModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
