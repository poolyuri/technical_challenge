import { CreatedPersonDto, CreatePersonDto, UpdatePersonDto } from "@infrastructure/entities/dtos/person/person.dto";
import { PersonEntity } from "@infrastructure/entities/person.entity";

export interface IPersonRepository {
  findAll(): Promise<PersonEntity[]>;
  findOne(id: string): Promise<PersonEntity | null>;
  create(createPersonDto: CreatePersonDto): Promise<CreatedPersonDto>;
  update(id: string, updatePersonDto: UpdatePersonDto): Promise<void>;
  delete(id: string): Promise<void>;
}
