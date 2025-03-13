import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ICustomRepository, People, Planet } from '@core';
import { v4 as uuidv4 } from 'uuid';
import { FusionEntity } from '@infrastructure/entities/fusion.entity';
import { EnviromentStrategy } from '@infrastructure/common/strategies/enviroment.strategy';
import { LoggerService } from '@infrastructure/logger/logger.service';
import {
  HistoryEntity
} from '@infrastructure/entities/history.entity';

@Injectable()
export class CustomRepository implements ICustomRepository {
  swapiUrl: string;
  weatherUrl: string;
  weatherKey: string;
  countriesUrl: string;

  dynamoClient = new DynamoDBClient();
  documentClient = DynamoDBDocumentClient.from(this.dynamoClient);

  constructor(
    private readonly httpService: HttpService,
    private readonly strategy: EnviromentStrategy,
    private readonly logger: LoggerService
  ) {
    this.swapiUrl = this.strategy.getSwapiUrl();
    this.weatherUrl = this.strategy.getWeatherUrl();
    this.weatherKey = this.strategy.getWeatherKey();
    this.countriesUrl = this.strategy.getCountriesUrl();
  }

  async findFusion(id: string): Promise<FusionEntity> {
    this.logger.log(CustomRepository.name, 'getting persons');
    const people = await this.getPeople(id);

    this.logger.log(CustomRepository.name, 'getting planets');
    const planet = await this.getPlanet(people.homeworld);

    this.logger.log(CustomRepository.name, 'getting country-name');
    const countryName = await this.getCountryName();

    this.logger.log(CustomRepository.name, 'getting weather');
    const weather = await this.getWeather(countryName);

    this.logger.log(CustomRepository.name, 'fusionando datos');
    const fusion: FusionEntity = new FusionEntity(
      people.name,
      people.gender,
      people.birth_year,
      planet.name,
      planet.climate,
      weather.current.condition.text,
    );
    
    await this.documentClient.send(
      new PutCommand({
        Item: { ...fusion, id: uuidv4() },
        TableName: 'History',
      }),
    );

    this.logger.log(CustomRepository.name, 'insert resources in dynamodb');

    return fusion;
  }

  async saveResource(resource: any): Promise<any> {
    this.logger.log(CustomRepository.name, 'insert resources');

    const custom = {
      ...resource,
      id: uuidv4(),
    };
    
    await this.documentClient.send(
      new PutCommand({
        Item: custom,
        TableName: 'Person',
      }),
    );

    return custom;
  }

  async findHistory(page: number, limit: number): Promise<HistoryEntity[]> {
    this.logger.log(CustomRepository.name, 'find history');

    const params = new ScanCommand({ 
      TableName: 'History'
    });
    
    const result = await this.documentClient.send(params);

    const start = (page - 1) * limit;
    const items = result.Items?.sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
    ).slice(start, start + limit) as HistoryEntity[];

    return items;
  }

  async getPeople(id: string): Promise<People> {
    const { data } = await firstValueFrom(
      this.httpService.get<People>(`${this.swapiUrl}/people/${id}/`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(CustomRepository.name, error.message);
          throw error.response?.data;
        }),
      ),
    );

    return data;
  }

  async getPlanet(url: string): Promise<Planet> {
    const { data } = await firstValueFrom(
      this.httpService.get<Planet>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(CustomRepository.name, error.message);
          throw error.response?.data;
        }),
      ),
    );

    return data;
  }

  async getWeather(countryName: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${this.weatherUrl}?key=${this.weatherKey}&q=${countryName}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(CustomRepository.name, error.message);
            throw error.response?.data;
          }),
        ),
    );

    return data;
  }

  async getCountryName(): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(this.countriesUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(CustomRepository.name, error.message);
          throw error.response?.data;
        }),
      ),
    );

    const number = Math.floor(Math.random() * 197);

    return data[number]?.name;
  }
}
