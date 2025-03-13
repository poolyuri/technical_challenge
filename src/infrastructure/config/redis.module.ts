import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { EnviromentConfigModule } from './enviroment.module';
import { CACHE_INSTANCE } from '@core';
import { RedisService } from '@infrastructure/services/redis/redis.service';
import { EnviromentStrategy } from '@infrastructure/common/strategies/enviroment.strategy';

@Module({
  imports: [EnviromentConfigModule],
  providers: [
    {
      provide: CACHE_INSTANCE,
      inject: [EnviromentStrategy, ConfigService],
      useFactory: async (config: EnviromentStrategy) => {
        const redisUrl = `redis://${config.getRedisUrl()}:${config.getRedisPort()}`;
        const secondary = new KeyvRedis(redisUrl);
        return new Cacheable({ secondary, ttl: config.getRedisTtl() });
      },
    },
    RedisService,
  ],
  exports: [CACHE_INSTANCE, RedisService],
})
export class RedisModule {}
