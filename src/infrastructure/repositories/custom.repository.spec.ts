import { HttpService } from '@nestjs/axios';
import { Observable, of } from 'rxjs';
import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { CustomRepository } from './custom.repository';
import { People, Planet } from '@core';
import { EnviromentStrategy } from '@infrastructure/common/strategies/enviroment.strategy';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { HistoryEntity } from '@infrastructure/entities/history.entity';

describe('CustomRepository', () => {
  let customRepository: CustomRepository;
  let httpServiceMock: HttpService;
  let strategyMock: EnviromentStrategy;
  let loggerMock: LoggerService;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(async () => {
    httpServiceMock = {} as HttpService;
    httpServiceMock.get = jest.fn();

    strategyMock = {} as EnviromentStrategy;
    strategyMock.getSwapiUrl = jest.fn();
    strategyMock.getWeatherUrl = jest.fn();
    strategyMock.getWeatherKey = jest.fn();
    strategyMock.getCountriesUrl = jest.fn();

    loggerMock = {} as LoggerService;
    loggerMock.log = jest.fn();

    customRepository = new CustomRepository(
      httpServiceMock,
      strategyMock,
      loggerMock,
    );
  });

  it('should be defined', async () => {
    expect(CustomRepository).toBeDefined();
  });

  it('findFusion => should return fusion', async () => {
    const people: People = {
      name: 'Luke Skywalker',
      gender: 'male',
      homeworld: 'https://swapi.dev/api/planets/1/',
      birth_year: '19BBY',
    };

    const planet: Planet = {
      name: 'Tatooine',
      climate: 'arid',
      rotation_period: 23,
      orbital_period: 304,
    };

    const countryName: string = 'Lima';
    const weather: any = {
      current: {
        condition: {
          text: 'Sunny',
        },
      },
    };

    jest.spyOn(customRepository, 'getPeople').mockResolvedValue(people);
    jest.spyOn(customRepository, 'getPlanet').mockResolvedValue(planet);
    jest
      .spyOn(customRepository, 'getCountryName')
      .mockResolvedValue(countryName);
    jest.spyOn(customRepository, 'getWeather').mockResolvedValue(weather);

    const result = await customRepository.findFusion('1');

    expect(result).toEqual({
      name: 'Luke Skywalker',
      gender: 'male',
      birth_year: '19BBY',
      name_planet: 'Tatooine',
      climate: 'arid',
      weather: 'Sunny',
    });
  });

  it('create => should create a new person and return its data', async () => {
    const resource: any = {
      id: 'id',
      name: 'name',
    };

    jest.spyOn(customRepository, 'saveResource').mockResolvedValue(resource);

    const result = await customRepository.saveResource(resource);

    expect(customRepository.saveResource).toHaveBeenCalled();
    expect(customRepository.saveResource).toHaveBeenCalledWith(resource);

    expect(result).toEqual(resource);
  });

  it('findHistory => should return history results', async () => {
    const history: HistoryEntity = {
      id: '1',
      name: 'Luke Skywalker',
      gender: 'male',
      birth_year: '19BBY',
      name_planet: 'Tatooine',
      climate: 'arid',
      weather: 'Sunny',
      createdAt: 12313123213,
      updatedAt: 12313123213,
    };

    const rescords: HistoryEntity[] = [history];

    jest.spyOn(customRepository, 'findHistory').mockResolvedValue(rescords);

    const result = await customRepository.findHistory(1, 2);

    expect(result).toEqual(rescords);
  });

  it('getPeople => should generate error with axios', async () => {
    const people: People = {
      name: 'Luke Skywalker',
      gender: 'male',
      homeworld: 'https://swapi.dev/api/planets/1/',
      birth_year: '19BBY',
    };

    const err = { response: 'resp', status: '500' };

    const httpSpy = jest
      .spyOn(httpServiceMock, 'get')
      .mockImplementationOnce(
        () => new Observable((subscriber) => subscriber.error(err)),
      );

    await customRepository.getPeople('1').catch((error: AxiosError) => {
      expect(error).toBeInstanceOf(TypeError);
      expect(error.response?.data).toEqual(undefined);
    });
  });

  it('getPeople => should return people with axios', async () => {
    const people: People = {
      name: 'Luke Skywalker',
      gender: 'male',
      homeworld: 'https://swapi.dev/api/planets/1/',
      birth_year: '19BBY',
    };

    const mockDocumentResponse: AxiosResponse = {
      status: 200,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        value: people,
      },
    };

    jest
      .spyOn(httpServiceMock, 'get')
      .mockImplementationOnce(() => of(mockDocumentResponse));

    const result = await customRepository.getPeople('1');
    expect(result).toMatchObject({ value: people });
  });

  it('getPlanet => should generate error with axios', async () => {
    const err = { response: 'resp', status: '500' };

    jest
      .spyOn(httpServiceMock, 'get')
      .mockImplementationOnce(
        () => new Observable((subscriber) => subscriber.error(err)),
      );

    await customRepository.getPlanet('1').catch((error: AxiosError) => {
      expect(error).toBeInstanceOf(TypeError);
      expect(error.response).toEqual(undefined);
    });
  });

  it('getPlanet => should return planet with axios', async () => {
    const planet: Planet = {
      name: 'Tatooine',
      climate: 'arid',
      rotation_period: 23,
      orbital_period: 304,
    };

    const mockDocumentResponse: AxiosResponse = {
      status: 200,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        value: planet,
      },
    };

    jest
      .spyOn(httpServiceMock, 'get')
      .mockImplementationOnce(() => of(mockDocumentResponse));

    const result = await customRepository.getPlanet('1');
    expect(result).toMatchObject({ value: planet });
  });

  it('getWeather => should generate error with axios', async () => {
    const err = { response: 'resp', status: '500' };

    jest
      .spyOn(httpServiceMock, 'get')
      .mockImplementationOnce(
        () => new Observable((subscriber) => subscriber.error(err)),
      );

    await customRepository.getWeather('1').catch((error: AxiosError) => {
      expect(error).toBeInstanceOf(TypeError);
      expect(error.response).toEqual(undefined);
    });
  });

  it('getWeather => should return weather with axios', async () => {
    const weather: any = {
      current: {
        condition: {
          text: 'Sunny',
        },
      },
    };

    const mockDocumentResponse: AxiosResponse = {
      status: 200,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        value: weather,
      },
    };

    jest
      .spyOn(httpServiceMock, 'get')
      .mockImplementationOnce(() => of(mockDocumentResponse));

    const result = await customRepository.getWeather('1');
    expect(result).toMatchObject({ value: weather });
  });

  it('getCountryName => should generate error with axios', async () => {
    const err = { response: 'resp', status: '500' };

    jest
      .spyOn(httpServiceMock, 'get')
      .mockImplementationOnce(
        () => new Observable((subscriber) => subscriber.error(err)),
      );

    await customRepository.getCountryName().catch((error: AxiosError) => {
      expect(error).toBeInstanceOf(TypeError);
      expect(error.response).toEqual(undefined);
    });
  });

  it('getCountryName => should return country with axios', async () => {
    const country: string | undefined = undefined;
    const countries: any = [country];

    const mockDocumentResponse: AxiosResponse = {
      status: 200,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        value: countries,
      },
    };

    jest
      .spyOn(httpServiceMock, 'get')
      .mockImplementationOnce(() => of(mockDocumentResponse));

    const result = await customRepository.getCountryName();
    expect(result).toEqual(country);
  });
});
