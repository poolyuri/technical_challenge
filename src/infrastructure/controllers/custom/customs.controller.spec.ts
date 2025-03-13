import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CustomsController } from './customs.controller';
import { AppModule } from '../../../app.module';
import { ICustomServiceInterface, Result } from '@core';
import { FusionEntity } from '@infrastructure/entities/fusion.entity';
import { HistoryEntity } from '@infrastructure/entities/history.entity';

describe('CustomsController', () => {
  let app: INestApplication;

  let controller: CustomsController;
  let customServiceMock: ICustomServiceInterface;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;

  beforeAll(async () => {
    customServiceMock = {} as ICustomServiceInterface;
    customServiceMock.findFusion = jest.fn();
    customServiceMock.saveResource = jest.fn();
    customServiceMock.findHistory = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('ICustomServiceInterface')
      .useValue(customServiceMock)
      .compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<CustomsController>(CustomsController);
    httpServer = app.getHttpServer();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findFusions => should find fusion', async () => {
    const id: string = '1';
    const fusion = {
      name: 'name',
    } as FusionEntity;

    const result: Result = new Result(true, 'Fusion found!', fusion);

    jest.spyOn(customServiceMock, 'findFusion').mockResolvedValueOnce(result);

    await request(httpServer)
      .get(`/customs/fusion/${id}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('saveResource => should create resource (dynamic data)', async () => {
    const resource: any = {
      key: 'key',
      value: 'value',
    };

    const result: Result = new Result(true, 'Resource created!', resource);

    jest.spyOn(customServiceMock, 'saveResource').mockResolvedValue(result);

    await request(httpServer)
      .post('/customs/resources')
      .send(resource)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('findHistory => should return all histories', async () => {
    const page: number = 1;
    const limit: number = 10;
    const history = {
      id: '1',
    } as HistoryEntity;

    const records: HistoryEntity[] = [history];

    const result: Result = new Result(true, 'Histories found!', records);

    jest.spyOn(customServiceMock, 'findHistory').mockResolvedValueOnce(result);

    await request(httpServer)
      .get(`/customs/history?page=${page}&limit=${limit}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Array);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
