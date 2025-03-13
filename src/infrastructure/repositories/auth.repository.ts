import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '@core';
import { PersonEntity } from '@infrastructure/entities/person.entity';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class AuthRepository implements IAuthRepository {
  async findUserByUsername(username: string): Promise<PersonEntity | null> {
    const dynamoClient = new DynamoDBClient({});
    const documentClient = DynamoDBDocumentClient.from(dynamoClient); 

    const params = new ScanCommand({ 
      TableName: 'Person'
    });

    const result = await documentClient.send(params);
    
    if (!result?.Items || result?.Items.length === 0) {
        return null;
    }

    const person: PersonEntity = result.Items
      .find((x) => x.username === username) as PersonEntity;
    
    return person;
  }
}
