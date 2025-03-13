import { Module } from '@nestjs/common';
import { RateLimiterModule } from '@infrastructure/config/rate-limiter.module';
import { AuthModule } from '@infrastructure/services/auth/auth.module';
import { LocalStrategy } from '@infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from '@infrastructure/common/strategies/jwt.strategy';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { PersonModule } from '@infrastructure/services/person/person.module';
import { CustomModule } from '@infrastructure/services/custom/custom.module';
import { RedisModule } from '@infrastructure/config/redis.module';

@Module({
  imports: [
    RateLimiterModule,
    RedisModule,
    LoggerModule,
    AuthModule,
    CustomModule,
    PersonModule
  ],
  providers: [LocalStrategy, JwtStrategy]
})
export class AppModule {}
