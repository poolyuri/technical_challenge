import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CryptoService } from '../crypto/crypto.service';
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { AuthRepository } from '@infrastructure/repositories/auth.repository';
import { AuthServiceProvider } from '@infrastructure/providers/auth.provider';
import { EnviromentStrategy } from '@infrastructure/common/strategies/enviroment.strategy';
import { EnviromentConfigModule } from '@infrastructure/config/enviroment.module';
import { LoggerService } from '@infrastructure/logger/logger.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnviromentConfigModule],
      inject: [EnviromentStrategy],
      useFactory: async (config: EnviromentStrategy) => ({
        secret: config.getJwtSecret(),
        signOptions: {
          expiresIn: config.getJwtExpirationTime(),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoggerService,
    AuthRepository,
    CryptoService,
    AuthServiceProvider,
  ],
  exports: [AuthRepository, CryptoService],
})
export class AuthModule {}
