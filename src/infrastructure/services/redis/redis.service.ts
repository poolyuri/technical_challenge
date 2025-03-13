import { Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_INSTANCE, IRedisInterface } from '@core';

@Injectable()
export class RedisService implements IRedisInterface {
  constructor(
    @Inject(CACHE_INSTANCE) private cacheManager: Cache
  ) {}

  async setCacheKey<T>(key: string, value: T): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async getCacheKey<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get(key);
  }

  async deleteCacheKey(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.clear();
  }
}
