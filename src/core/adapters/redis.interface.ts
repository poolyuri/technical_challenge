export interface IRedisInterface {
  setCacheKey<T>(key: string, value: T): Promise<void>;
  getCacheKey<T>(key: string): Promise<T | null>;
  deleteCacheKey(key: string): Promise<void>
  clearCache(): Promise<void>;
}