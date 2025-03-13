import { PersonsController } from '@infrastructure/controllers/persons/persons.controller';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { PersonServiceProvider } from '@infrastructure/providers/person.provide';
import { PersonRepository } from '@infrastructure/repositories/person.repository';
import { Module } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { RedisModule } from '@infrastructure/config/redis.module';

@Module({
  imports: [
    RedisModule
  ],
  controllers: [
    PersonsController
  ],
  providers: [
    LoggerService, 
    PersonRepository, 
    CryptoService,
    PersonServiceProvider
  ],
  exports: [PersonRepository],
})
export class PersonModule {}
