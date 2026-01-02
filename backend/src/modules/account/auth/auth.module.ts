import { Module, ModuleMetadata } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UsersModule } from '../users/users.module';
import getEnvVariable from '../../../utils/getEnvVariable';
import { StringValue } from 'ms';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: getEnvVariable<string>('JWT_SECRET'),
      signOptions: { expiresIn: getEnvVariable<StringValue>('JWT_EXPIRES_IN') },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
} as ModuleMetadata)
export class AuthModule {}
