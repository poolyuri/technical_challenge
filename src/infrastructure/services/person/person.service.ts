import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  ICryptoInterface,
  ILogger,
  IPersonRepository,
  IPersonServiceInterface,
  IRedisInterface,
  Result,
} from '@core';
import { PersonEntity } from '@infrastructure/entities/person.entity';
import { CreatedPersonDto, CreatePersonDto, UpdatePersonDto } from '@infrastructure/entities/dtos/person/person.dto';

@Injectable()
export class PersonService implements IPersonServiceInterface {
  constructor(
    private readonly logger: ILogger,
    private readonly personRepository: IPersonRepository,
    private readonly cryptoService: ICryptoInterface,
    private readonly redisService: IRedisInterface,

  ) {}

  async findAll(): Promise<Result> {
    const key = `persons`;
    const cachePersons = await this.redisService.getCacheKey<PersonEntity[]>(key);

    if (cachePersons) {
      this.logger.log(PersonService.name, 'persons found in memory cache');
      return new Result(true, 'Persons found in memory cache!', cachePersons);
    }
    
    const persons: PersonEntity[] = await this.personRepository.findAll();
    this.logger.log(PersonService.name, 'persons found');

    this.redisService.setCacheKey<PersonEntity[]>(key, persons);
    this.logger.log(PersonService.name, 'save persons in memory cache');

    return new Result(true, 'Persons found!', plainToInstance(CreatedPersonDto, persons));
  }

  async findOne(id: string): Promise<Result> {
    const key = `persons-${id}`;
    const cachePerson = await this.redisService.getCacheKey<PersonEntity>(key);

    if (cachePerson) {
      this.logger.log(PersonService.name, `person with id ${id} found in memory cache`);
      return new Result(true, 'Person found in memory cache!', cachePerson);
    } 

    const person: PersonEntity | null = await this.personRepository.findOne(id);
    this.logger.log(PersonService.name, 'persons found');

    if (person) {
      this.redisService.setCacheKey<PersonEntity>(key, person);
      this.logger.log(PersonService.name, 'save persons in memory cache');
    }
    
    return new Result(true, 'Person found!', plainToInstance(CreatedPersonDto, person));
  }

  async create(createPersonDto: CreatePersonDto): Promise<Result> {
    const password = this.cryptoService.encrypt(createPersonDto.password);

    const person: CreatedPersonDto = await this.personRepository.create({
      ...createPersonDto,
      password
    });

    this.logger.log(PersonService.name, 'new person have been inserted');
    return new Result(
      true,
      'Person created!',
      plainToInstance(CreatedPersonDto, person),
    );
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Result> {
    const updatedPerson = plainToInstance(PersonEntity, updatePersonDto);    
    await this.personRepository.update(id, updatePersonDto);

    this.logger.log(PersonService.name, 'person have been updated');
    return new Result(true, 'Person updated!', updatedPerson);
  }

  async delete(id: string): Promise<Result> {
    await this.personRepository.delete(id);

    this.logger.log(PersonService.name, 'person have been eleted');
    return new Result(true, 'Person deleted!');
  }
}
