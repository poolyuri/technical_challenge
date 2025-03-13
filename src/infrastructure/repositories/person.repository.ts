import { Injectable } from '@nestjs/common';
import { IPersonRepository } from '@core';
import { PersonEntity } from '@infrastructure/entities/person.entity';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import {
  CreatedPersonDto,
  CreatePersonDto,
  UpdatePersonDto,
} from '@infrastructure/entities/dtos/person/person.dto';

@Injectable()
export class PersonRepository implements IPersonRepository {
  dynamoClient = new DynamoDBClient();
  documentClient = DynamoDBDocumentClient.from(this.dynamoClient);

  async findAll(): Promise<PersonEntity[]> {
    const params = new ScanCommand({
      TableName: 'Person',
    });

    const result = await this.documentClient.send(params);

    return result.Items ? (result.Items as PersonEntity[]) : [];
  }

  async findOne(id: string): Promise<PersonEntity | null> {
    const params = new GetCommand({
      TableName: 'Person',
      Key: {
        id: id,
      },
    });

    const result = await this.documentClient.send(params);

    if (result.Item === null || !result.Item) {
      return null;
    }

    return result.Item as PersonEntity;
  }

  async create(createPersonDto: CreatePersonDto): Promise<CreatedPersonDto> {    
    const person = plainToInstance(PersonEntity, {
      ...createPersonDto,
      isActive: true,
      id: uuidv4(),
    });

    await this.documentClient.send(
      new PutCommand({
        Item: person,
        TableName: 'Person',
      }),
    );

    return person;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<void> {
    await this.documentClient.send(
      new UpdateCommand({
        TableName: 'Person',
        Key: { id: id },
        UpdateExpression:
          'set username = :username, firstName = :firstName, lastName = :lastName, email = :email, isActive = :isActive',
        ExpressionAttributeValues: {
          ':username': updatePersonDto.username,
          ':firstName': updatePersonDto.firstName,
          ':lastName': updatePersonDto.lastName,
          ':email': updatePersonDto.email,
          ':isActive': updatePersonDto.isActive
        },
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.documentClient.send(
      new DeleteCommand({
        TableName: 'Person',
        Key: { id: id }
      }),
    );
  }
}
