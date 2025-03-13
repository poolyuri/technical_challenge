import { Test } from '@nestjs/testing';
import { Cache } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { CACHE_INSTANCE } from '@core';

describe('RedisService', () => {
  let service: RedisService;
  let cache: Cache;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_INSTANCE,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
            del: () => jest.fn(),
            clear: () => jest.fn(),
          },
        },
      ],
    })
    .compile();

    service = app.get<RedisService>(RedisService);
    cache = app.get(CACHE_INSTANCE);
  });

  it('setCacheKey => should cache the value', async () => {
    const key: string = 'redistest';
    const value: string = 'test';

    const spy = jest.spyOn(cache, 'set');

    await service.setCacheKey(key, value);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual(key);
    expect(spy.mock.calls[0][1]).toEqual(value);
  });


  it('getCacheKey => should return the value from the cache', async () => {
    const key: string = 'redistest';
    const value: string = 'test';

    jest.spyOn(cache, 'get').mockResolvedValueOnce(value);
    
    const res = await service.getCacheKey(key);

    expect(res).toEqual(value);
  });

  it('deleteCacheKey => should delete cache', async () => {
    const key: string = 'redistest';
    const value: string = 'test';

    const spy = jest.spyOn(cache, 'del');

    await service.deleteCacheKey(key);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual(key);
  });

  it('clearCache => should clear cache', async () => {
    const key: string = 'redistest';
    const value: string = 'test';

    const spy = jest.spyOn(cache, 'clear');

    await service.clearCache();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});