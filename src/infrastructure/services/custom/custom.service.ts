import { Injectable } from '@nestjs/common';
import {
  ICustomRepository,
  ICustomServiceInterface,
  ILogger,
  IRedisInterface,
  Result,
} from '@core';
import { FusionEntity } from '@infrastructure/entities/fusion.entity';
import { HistoryEntity } from '@infrastructure/entities/history.entity';

@Injectable()
export class CustomService implements ICustomServiceInterface {
  constructor(
    private readonly logger: ILogger,
    private readonly customRepository: ICustomRepository,
    private readonly redisService: IRedisInterface,
  ) {}

  async findFusion(id: string): Promise<Result> {
    const key = `fusion-${id}`;
    const cacheFusion = await this.redisService.getCacheKey<FusionEntity>(key);

    if (cacheFusion) {
      this.logger.log(CustomService.name, 'fusion found in memory cache');
      return new Result(true, 'Fusion found in memory cache!', cacheFusion);
    }

    const fusion: FusionEntity = await this.customRepository.findFusion(id);
    this.logger.log(CustomService.name, 'fusion found');

    this.redisService.setCacheKey<FusionEntity>(key, fusion);
    this.logger.log(CustomService.name, 'save fusion in memory cache');

    return new Result(true, 'Fusion found!', fusion);
  }

  async saveResource(resource: any): Promise<Result> {
    const resourceCreated = await this.customRepository.saveResource(resource);
    this.logger.log(CustomService.name, 'new resource have been inserted');
    return new Result(true, 'Resource created!', resourceCreated);
  }

  async findHistory(page: number, limit: number): Promise<Result> {
    const records: HistoryEntity[] = await this.customRepository.findHistory(
      page,
      limit,
    );
    this.logger.log(CustomService.name, 'histories found');
    return new Result(true, 'Histories found!', records);
  }
}
