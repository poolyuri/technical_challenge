import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EnviromentConfigModule } from './enviroment.module';
import { EnviromentStrategy } from '@infrastructure/common/strategies/enviroment.strategy';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [EnviromentConfigModule],
      inject: [EnviromentStrategy],
      useFactory: (config: EnviromentStrategy) => [
        {
          ttl: config.getThorttleTtl(),
          limit: config.getThorttleLimit(),
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RateLimiterModule {}
