import { plainToInstance } from 'class-transformer';
import { PersonService } from './person.service';
import { CryptoService } from '../crypto/crypto.service';
import { ICryptoInterface, ILogger, IPersonRepository, IRedisInterface, Result } from '@core';
import { PersonEntity } from '@infrastructure/entities/person.entity';
import {
  CreatedPersonDto,
  CreatePersonDto,
  UpdatePersonDto,
} from '@infrastructure/entities/dtos/person/person.dto';

describe('UserService', () => {
  let personService: PersonService;
  let loggerMock: ILogger;
  let personRepositoryMock: IPersonRepository;
  let cryptoServiceMock: ICryptoInterface;
  let redisServiceMock: IRedisInterface

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});

    personService = {} as PersonService;
    personService.findAll = jest.fn();
    personService.findOne = jest.fn();
    personService.create = jest.fn();
    personService.update = jest.fn();
    personService.delete = jest.fn();

    loggerMock = {} as ILogger;
    loggerMock.log = jest.fn();

    personRepositoryMock = {} as IPersonRepository;
    personRepositoryMock.findAll = jest.fn();
    personRepositoryMock.findOne = jest.fn();
    personRepositoryMock.create = jest.fn();
    personRepositoryMock.update = jest.fn();
    personRepositoryMock.delete = jest.fn();

    cryptoServiceMock = {} as CryptoService;
    cryptoServiceMock.encrypt = jest.fn();

    redisServiceMock = {} as IRedisInterface
    redisServiceMock.getCacheKey = jest.fn();
    redisServiceMock.setCacheKey = jest.fn();

    personService = new PersonService(
      loggerMock,
      personRepositoryMock,
      cryptoServiceMock,
      redisServiceMock
    );
  });

  it('findAll => should return persons if exists', async () => {
    const person = {
      id: '1',
    } as PersonEntity;

    const persons: PersonEntity[] = [person];

    jest.spyOn(redisServiceMock, 'getCacheKey').mockResolvedValue(null);

    const cache = await redisServiceMock.getCacheKey('');
    expect(cache).toEqual(null);

    jest.spyOn(personRepositoryMock, 'findAll').mockResolvedValue(persons);

    const result = await personService.findAll();

    expect(personRepositoryMock.findAll).toHaveBeenCalled();

    expect(result).toEqual(
      new Result(true, 'Persons found!', plainToInstance(CreatedPersonDto, persons)),
    );
  });

  it('findAll => should return persons in memory cache if exists in redis', async () => {
    const person = {
      id: '1',
    } as PersonEntity;

    const persons: PersonEntity[] = [person];

    jest.spyOn(redisServiceMock, 'getCacheKey').mockResolvedValue(persons);

    const cache = await redisServiceMock.getCacheKey<PersonEntity[]>('persons');

    jest.spyOn(personRepositoryMock, 'findAll').mockResolvedValue([]);

    const result = await personService.findAll();

    expect(personRepositoryMock.findAll).toHaveBeenCalledTimes(0);
    expect(redisServiceMock.getCacheKey).toHaveBeenCalledTimes(2);

    expect(cache).toEqual(cache);
    expect(result).toEqual(
      new Result(true, 'Persons found in memory cache!', cache as PersonEntity[]),
    );
  });

  it('findOne => should return person if exists', async () => {
    const id: string = '1';
    const person = {
      id: '1',
    } as PersonEntity;

    jest.spyOn(redisServiceMock, 'getCacheKey').mockResolvedValue(null);

    const cache = await redisServiceMock.getCacheKey('');
    expect(cache).toEqual(null);

    jest.spyOn(personRepositoryMock, 'findOne').mockResolvedValue(person);

    const result = await personService.findOne(id);

    expect(personRepositoryMock.findOne).toHaveBeenCalled();

    expect(result).toEqual(
      new Result(true, 'Person found!', plainToInstance(CreatedPersonDto, person)),
    );
  });

  it('findOne => should return person in memory cache if exists in redis', async () => {
    const id: string = '1';
    const person = {
      id: '1',
    } as PersonEntity;

    jest.spyOn(redisServiceMock, 'getCacheKey').mockResolvedValue(person);

    const cache = await redisServiceMock.getCacheKey<PersonEntity>('person-1');

    jest.spyOn(personRepositoryMock, 'findOne').mockResolvedValue(null);

    const result = await personService.findOne(id);

    expect(personRepositoryMock.findOne).toHaveBeenCalledTimes(0);
    expect(redisServiceMock.getCacheKey).toHaveBeenCalledTimes(2);

    expect(cache).toEqual(cache);
    expect(result).toEqual(
      new Result(true, 'Person found in memory cache!', cache as PersonEntity),
    );
  });

  it('create => should create a new person and return data', async () => {
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

    const password: string = '123456';

    jest
      .spyOn(cryptoServiceMock, 'encrypt').mockReturnValue(password);
    jest
      .spyOn(personRepositoryMock, 'create')
      .mockResolvedValue(createdPersonDto as PersonEntity);

    const result = await personService.create(createPersonDto);

    expect(personRepositoryMock.create).toHaveBeenCalled();
    expect(personRepositoryMock.create).toHaveBeenCalledWith(createPersonDto);

    expect(result).toEqual(
      new Result(
        true,
        'Person created!',
        plainToInstance(CreatedPersonDto, createPersonDto),
      ),
    );
  });

  it('update => should update a person by id', async () => {
    const id = '1';
    const updatePersonDto: UpdatePersonDto = {
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastname',
      email: 'email@email.com',
      isActive: true
    };

    jest.spyOn(personRepositoryMock, 'update');

    const result = await personService.update(id, updatePersonDto);

    expect(personRepositoryMock.update).toHaveBeenCalled();
    expect(personRepositoryMock.update).toHaveBeenCalledWith(id, updatePersonDto);

    expect(result).toEqual(new Result(true, 'Person updated!', updatePersonDto));
  });

  it('remove => should delete a person by id', async () => {
    const id = '1';

    jest.spyOn(personRepositoryMock, 'delete');

    const result = await personService.delete(id);

    expect(personRepositoryMock.delete).toHaveBeenCalled();
    expect(personRepositoryMock.delete).toHaveBeenCalledWith(id);

    expect(result).toEqual(new Result(true, 'Person deleted!'));
  });

  afterAll(async () => {
    if ((redisServiceMock as any).redis) {
      await (redisServiceMock as any).redis.quit(); 
    }
  });
});