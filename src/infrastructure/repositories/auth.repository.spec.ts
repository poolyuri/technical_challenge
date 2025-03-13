import { Test, TestingModule } from '@nestjs/testing';
import { PersonEntity } from '@infrastructure/entities/person.entity';
import { AuthRepository } from './auth.repository';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(async () => {
    ddbMock.reset();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [AuthRepository],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', async () => {
    expect(AuthRepository).toBeDefined();
  });

  it('findUserByUsername => should return null if user by username does not exist', async () => {
    const username = 'test';
    const person: PersonEntity | null = null;

    const result = await authRepository.findUserByUsername(username);

    expect(result).toStrictEqual(person);
  });

  it('findUserByUsername => should return object if exists user by username', async () => {
    const username: string = 'poolyuri';
    const user = {
      username,
    } as PersonEntity;

    jest.spyOn(authRepository, 'findUserByUsername').mockResolvedValue(user);

    const result = await authRepository.findUserByUsername(username);

    expect(authRepository.findUserByUsername).toHaveBeenCalled();
    expect(authRepository.findUserByUsername).toHaveBeenCalledWith(username);

    expect(result).toStrictEqual(user);
  });
});
