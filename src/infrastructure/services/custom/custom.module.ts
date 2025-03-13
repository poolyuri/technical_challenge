import { Module } from '@nestjs/common';
import { CustomsController } from '@infrastructure/controllers/custom/customs.controller';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { FusionServiceProvider } from '@infrastructure/providers/custom.providet';
import { CustomRepository } from '@infrastructure/repositories/custom.repository';
import { EnviromentStrategy } from '@infrastructure/common/strategies/enviroment.strategy';
import { MicroserviceConfigModule } from '@infrastructure/config/microservice.module';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from '@infrastructure/config/redis.module';

@Module({
  imports: [
    MicroserviceConfigModule,
    RedisModule
  ],
  controllers: [CustomsController],
  providers: [
    EnviromentStrategy,
    LoggerService,
    CustomRepository,
    FusionServiceProvider,
    RedisService
  ],
  exports: [CustomRepository],
})
export class CustomModule {}
