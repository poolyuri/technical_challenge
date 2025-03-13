import { Result } from "@core";

export const CUSTOM_PORT_SERVICE = 'CustomPortService';

export interface ICustomServiceInterface {
  findFusion(id: string): Promise<Result>;
  saveResource(resource: any): Promise<Result>;
  findHistory(page: number, limit: number): Promise<Result>;
}