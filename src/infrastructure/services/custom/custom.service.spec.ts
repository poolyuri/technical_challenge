import { plainToInstance } from 'class-transformer';
import { CustomService } from './custom.service';
import { ICustomRepository, ILogger, IRedisInterface, Result } from '@core';
import { PersonEntity } from '@infrastructure/entities/person.entity';
import { FusionEntity } from '@infrastructure/entities/fusion.entity';
import { HistoryEntity } from '@infrastructure/entities/history.entity';

describe('CustomService', () => {
  let customService: CustomService;
  let loggerMock: ILogger;
  let customRepositoryMock: ICustomRepository;
  let redisServiceMock: IRedisInterface;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});

    customService = {} as CustomService;
    customService.findFusion = jest.fn();
    customService.saveResource = jest.fn();
    customService.findHistory = jest.fn();

    loggerMock = {} as ILogger;
    loggerMock.log = jest.fn();

    customRepositoryMock = {} as ICustomRepository;
    customRepositoryMock.findFusion = jest.fn();
    customRepositoryMock.saveResource = jest.fn();
    customRepositoryMock.findHistory = jest.fn();

    redisServiceMock = {} as IRedisInterface;
    redisServiceMock.getCacheKey = jest.fn();
    redisServiceMock.setCacheKey = jest.fn();

    customService = new CustomService(
      loggerMock,
      customRepositoryMock,
      redisServiceMock,
    );
  });

  it('findFusion => should return history in memory cache if exists in redis', async () => {
    const id: string = 'id';
    const fusion = {
      name: 'fusion',
    } as FusionEntity;

    jest.spyOn(redisServiceMock, 'getCacheKey').mockResolvedValue(fusion);

    const cache = await redisServiceMock.getCacheKey<PersonEntity>('fusion-1');

    jest.spyOn(customRepositoryMock, 'findFusion').mockResolvedValue(fusion);

    const result = await customService.findFusion(id);

    expect(customRepositoryMock.findFusion).toHaveBeenCalledTimes(0);
    expect(redisServiceMock.getCacheKey).toHaveBeenCalledTimes(2);

    expect(cache).toEqual(cache);
    expect(result).toEqual(
      new Result(true, 'Fusion found in memory cache!', cache as PersonEntity),
    );
  });

  it('findFusion => should return fusion if exists', async () => {
    const id: string = 'id';
    const fusion = {
      name: 'fusion',
    } as FusionEntity;

    jest.spyOn(redisServiceMock, 'getCacheKey').mockResolvedValue(null);

    const cache = await redisServiceMock.getCacheKey('');
    expect(cache).toEqual(null);

    jest.spyOn(customRepositoryMock, 'findFusion').mockResolvedValue(fusion);

    const result = await customService.findFusion(id);

    expect(customRepositoryMock.findFusion).toHaveBeenCalled();

    expect(result).toEqual(new Result(true, 'Fusion found!', fusion));
  });

  it('saveResource => should create a new resource (dynamic data)', async () => {
    const resource: any = {
      name: 'name',
    };

    jest
      .spyOn(customRepositoryMock, 'saveResource')
      .mockResolvedValue(resource);

    const result = await customService.saveResource(resource);

    expect(customRepositoryMock.saveResource).toHaveBeenCalled();
    expect(customRepositoryMock.saveResource).toHaveBeenCalledWith(resource);

    expect(result).toEqual(new Result(true, 'Resource created!', resource));
  });

  it('findHistory => should return records if exists', async () => {
    const history = {
      id: '1',
    } as HistoryEntity;

    const records: HistoryEntity[] = [history];

    jest.spyOn(customRepositoryMock, 'findHistory').mockResolvedValue(records);

    const result = await customService.findHistory(1, 1);

    expect(customRepositoryMock.findHistory).toHaveBeenCalledTimes(1);

    expect(result).toEqual(new Result(true, 'Histories found!', records));
  });

  afterAll(async () => {
    if ((redisServiceMock as any).redis) {
      await (redisServiceMock as any).redis.quit(); 
    }
  });
});
