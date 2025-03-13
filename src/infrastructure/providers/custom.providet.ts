import { CUSTOM_PORT_SERVICE } from '@core';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { CustomRepository } from '@infrastructure/repositories/custom.repository';
import { CustomService } from '@infrastructure/services/custom/custom.service';
import { RedisService } from '@infrastructure/services/redis/redis.service';

export const FusionServiceProvider = {
  inject: [LoggerService, CustomRepository, RedisService],
  provide: CUSTOM_PORT_SERVICE,
  useFactory: (
    loggerService: LoggerService,
    fusionRepository: CustomRepository,
    redisService: RedisService
  ) => new CustomService(loggerService, fusionRepository, redisService)
};
