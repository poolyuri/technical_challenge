import { Test, TestingModule } from '@nestjs/testing';
import { PersonRepository } from './person.repository';
import { PersonEntity } from '@infrastructure/entities/person.entity';
import {
  CreatedPersonDto,
  CreatePersonDto,
  UpdatePersonDto,
} from '@infrastructure/entities/dtos/person/person.dto';
import { plainToInstance } from 'class-transformer';

describe('PersonRepository', () => {
  let personRepository: PersonRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [PersonRepository],
    }).compile();

    personRepository = module.get<PersonRepository>(PersonRepository);
  });

  it('should be defined', async () => {
    expect(PersonRepository).toBeDefined();
  });

  it('findAll => should return all persons', async () => {
    const person = {
      id: '1',
    } as PersonEntity;

    const persons: PersonEntity[] = [person];

    jest.spyOn(personRepository, 'findAll').mockResolvedValue(persons);

    const result = await personRepository.findAll();

    expect(personRepository.findAll).toHaveBeenCalled();

    expect(result).toStrictEqual(persons);
  });

  it('findOne => should return null if person by id does not exist', async () => {
    const id: string = '1';

    jest.spyOn(personRepository, 'findOne').mockResolvedValue(null);

    const result = await personRepository.findOne(id);

    expect(personRepository.findOne).toHaveBeenCalled();
    
    expect(personRepository.findOne).toHaveBeenCalledWith(id);

    expect(result).toStrictEqual(null);
  });

  it('findOne => should return object if exists person by id', async () => {
    const id: string = '1';
    const person = {
      id,
    } as PersonEntity | null;

    jest.spyOn(personRepository, 'findOne').mockResolvedValue(person);

    const result = await personRepository.findOne(id);

    expect(personRepository.findOne).toHaveBeenCalled();
    expect(personRepository.findOne).toHaveBeenCalledWith(id);

    expect(result).toEqual(person);
  });

  it('create => should create a new person and return its data', async () => {
    const createPersonDto: CreatePersonDto = {
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastname',
      email: 'email@email.com',
      password: '123456',
    };

    const createdPersonDto: CreatedPersonDto = {
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastname',
      email: 'email@email.com',
      password: '123456',
    };

    jest
      .spyOn(personRepository, 'create')
      .mockResolvedValue(plainToInstance(PersonEntity, createdPersonDto));

    const result = await personRepository.create(createPersonDto);

    expect(personRepository.create).toHaveBeenCalled();
    expect(personRepository.create).toHaveBeenCalledWith(createPersonDto);

    expect(result).toEqual(createdPersonDto);
  });

  it('update => should update a person by id', async () => {
    const id: string = '1';

    const updatePersonDto: UpdatePersonDto = {
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastname',
      email: 'email@email.com',
      isActive: true,
    };

    jest.spyOn(personRepository, 'update');

    const result = await personRepository.update(id, updatePersonDto);

    expect(personRepository.update).toHaveBeenCalled();
    expect(personRepository.update).toHaveBeenCalledWith(id, updatePersonDto);

    expect(result).toBe(void 0);
  });

  it('remove => should delete a person by id', async () => {
    const id: string = '1';

    jest.spyOn(personRepository, 'delete');

    const result = await personRepository.delete(id);

    expect(personRepository.delete).toHaveBeenCalled();
    expect(personRepository.delete).toHaveBeenCalledWith(id);

    expect(result).toBe(void 0);
  });
});
