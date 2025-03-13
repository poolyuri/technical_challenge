import { Result } from "@core";
import { CreatePersonDto, UpdatePersonDto } from "@infrastructure/entities/dtos/person/person.dto";

export const PERSON_PORT_SERVICE = 'PersonPortService';

export interface IPersonServiceInterface {
  findAll(): Promise<Result>;
  findOne(id: String): Promise<Result>;
  create(createPersonDto: CreatePersonDto): Promise<Result>;
  update(id: string, updatePersonDto: UpdatePersonDto): Promise<Result>;
  delete(id: string): Promise<Result>;
}