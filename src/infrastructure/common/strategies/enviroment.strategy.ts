import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JWTConfig,
  MicroserviceConfig,
  RedisConfig,
  ThorttleConfig,
} from '@core';

@Injectable()
export class EnviromentStrategy
  implements JWTConfig, MicroserviceConfig, ThorttleConfig, RedisConfig
{
  constructor(private readonly configService: ConfigService) {}

  getJwtSecret(): string {
    return this.configService.get<string>('jwt.secret') || '';
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('jwt.expiresIn') || '';
  }

  getHttpTimeout(): number {
    return this.configService.get<number>('http.timeout') || 3000;
  }

  getHttpMaxRedirects(): number {
    return this.configService.get<number>('http.maxRedirects') || 3;
  }

  getSwapiUrl(): string {
    return this.configService.get<string>('swapi.url') || '';
  }

  getWeatherUrl(): string {
    return this.configService.get<string>('weather.url') || '';
  }

  getWeatherKey(): string {
    return this.configService.get<string>('weather.key') || '';
  }

  getCountriesUrl(): string {
    return this.configService.get<string>('countries.url') || '';
  }

  getThorttleTtl(): number {
    return this.configService.get<number>('thorttle.ttl') || 3000;
  }

  getThorttleLimit(): number {
    return this.configService.get<number>('thorttle.limit') || 3;
  }

  getRedisUrl(): string {
    return this.configService.get<string>('redis.url') || '';
  }

  getRedisPort(): number {
    return this.configService.get<number>('redis.port') || 6379;
  }

  getRedisTtl(): string {
    return this.configService.get<string>('redis.ttl') || '30m';
  }
}
