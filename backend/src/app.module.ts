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
    UsersModule,
    AuthModule,
    GameModule,
    // GameSceneModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
