import { FusionEntity } from "@infrastructure/entities/fusion.entity";
import { HistoryEntity } from "@infrastructure/entities/history.entity";

export interface ICustomRepository {
  findFusion(id: string): Promise<FusionEntity>;
  saveResource(resource: any): Promise<any>;
  findHistory(page: number, limit: number): Promise<HistoryEntity[]>;
}
