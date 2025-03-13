export const CACHE_INSTANCE = 'CACHE_INSTANCE';

export interface RedisConfig {
  getRedisUrl(): string;
  getRedisPort(): number;
  getRedisTtl(): string;
}
