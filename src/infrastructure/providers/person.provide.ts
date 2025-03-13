import { PERSON_PORT_SERVICE } from '@core';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { PersonRepository } from '@infrastructure/repositories/person.repository';
import { CryptoService } from '@infrastructure/services/crypto/crypto.service';
import { PersonService } from '@infrastructure/services/person/person.service';
import { RedisService } from '@infrastructure/services/redis/redis.service';

export const PersonServiceProvider = {
  inject: [LoggerService, PersonRepository, CryptoService, RedisService],
  provide: PERSON_PORT_SERVICE,
  useFactory: (
    loggerService: LoggerService,
    personRepository: PersonRepository,
    cryptoService: CryptoService,
    redisService: RedisService
  ) => new PersonService(loggerService, personRepository, cryptoService, redisService),
};
