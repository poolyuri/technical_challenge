import { PersonEntity } from "@infrastructure/entities/person.entity";

export interface IAuthRepository {
  findUserByUsername(username: string): Promise<PersonEntity | null>;
}
