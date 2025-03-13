import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import request from 'supertest';
import { PersonsController } from './persons.controller';
import { AppModule } from '../../../app.module';
import { AuthDto } from '@infrastructure/entities/dtos/auth/auth.dto';
import { PersonEntity } from '@infrastructure/entities/person.entity';
import { IPersonServiceInterface, Result } from '@core';
import {
  CreatedPersonDto,
  CreatePersonDto,
  UpdatePersonDto,
} from '@infrastructure/entities/dtos/person/person.dto';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';

describe('PersonsController', () => {
  let app: INestApplication;

  let controller: PersonsController;
  let personServiceMock: IPersonServiceInterface;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let token: string;
  let idPerson: string;
  let username: string;

  beforeAll(async () => {
    personServiceMock = {} as IPersonServiceInterface;
    personServiceMock.findAll = jest.fn();
    personServiceMock.findOne = jest.fn();
    personServiceMock.create = jest.fn();
    personServiceMock.update = jest.fn();
    personServiceMock.delete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('IPersonServiceInterface')
      .useValue(personServiceMock)
      .compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<PersonsController>(PersonsController);
    httpServer = app.getHttpServer();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login => should login success', async () => {
    const authDto: AuthDto = {
      username: 'pakkun',
      password: '123456',
    };

    await request(httpServer)
      .post('/auth/login')
      .send(authDto)
      .then((response) => {
        token = response.body.data.token;
      });
  });

  it('findAll => Unauthorized token', async () => {
    await request(httpServer)
      .get('/persons')
      .set(
        'Authorization',
        `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InB1YmxpY0lkIjoicG9vbHl1cmk5OTk5IiwibmFtZSI6IlBvb2wgWXVyaXZpbGNhIEFsYW5pYSJ9LCJpYXQiOjE3Mzk0MDU0NDYsImV4cCI6MTE1MzQ2NzY1NDQ2fQ.0R9JjzFSBOEdKihaIdlI7j3_pLtkVy2CwHZ0FvBWFOA'}`,
      )
      .expect(HttpStatus.UNAUTHORIZED)
      .catch((error) => {
        expect(error.status).toBe(401);
        expect(error).toBeInstanceOf(UnauthorizedException);
      });
  });

  it('findAll => should find all persons', async () => {
    const person = {
      id: '1',
    } as PersonEntity;

    const persons: PersonEntity[] = [person];

    const result: Result = new Result(true, 'Persons found!', persons);

    jest.spyOn(personServiceMock, 'findAll').mockResolvedValueOnce(result);

    await request(httpServer)
      .get('/persons')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Array);
      });
  });

  it('create => should create person', async () => {
    const [value] = randomUUID().split('-');
    username = value;
    const createPersonDto: CreatePersonDto = {
      username,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
    };

    const password = createPersonDto.password;
    const result: Result = new Result(
      true,
      'Person created!',
      plainToInstance(CreatedPersonDto, createPersonDto),
    );

    jest.spyOn(personServiceMock, 'create').mockResolvedValue(result);

    await request(httpServer)
      .post('/persons')
      .send(createPersonDto)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        const { data } = response.body;
        idPerson = data.id;
        
        expect(typeof idPerson).toBe('string');
        expect(data).toBeInstanceOf(Object);
      });
  });
  
  it('findOne => should find person by id', async () => {
    const person = {
      id: idPerson,
    } as PersonEntity;

    const result: Result = new Result(true, 'Person found!', person);

    jest.spyOn(personServiceMock, 'findOne').mockResolvedValueOnce(result);

    await request(httpServer)
      .get(`/persons/${person.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('update => should update person', async () => {
    const id: string = idPerson;
    const [username] = randomUUID().split('-');
    const updatePersonDto: UpdatePersonDto = {
      username,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      isActive: true
    };

    const result: Result = new Result(
      true,
      'Person updated!',
      plainToInstance(PersonEntity, updatePersonDto),
    );

    jest.spyOn(personServiceMock, 'update').mockResolvedValue(result);

    await request(httpServer)
      .put(`/persons/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatePersonDto)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('delete => should delete person', async () => {
    const id: string = idPerson;

    const result: Result = new Result(true, 'Person deleted!');

    jest.spyOn(personServiceMock, 'delete').mockResolvedValue(result);

    await request(httpServer)
      .delete(`/persons/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(result);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});