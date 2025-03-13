import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthRepository } from '@infrastructure/repositories/auth.repository';
import { CryptoService } from '@infrastructure/services/crypto/crypto.service';
import { Result } from '@core';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { PersonEntity } from '@infrastructure/entities/person.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly cryptoService: CryptoService,
    private readonly logger: LoggerService
  ) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<PersonEntity | null> {
    const person: PersonEntity | null = await this.authRepository.findUserByUsername(username);
    
    if (!person) {
      this.logger.warn('LocalStrategy', `Incorrect username!`);
      throw new UnauthorizedException(
        new Result(false, 'Incorrect username!'),
      );
    }
    
    const isValidPass: boolean = this.cryptoService.verify(
      person?.password,
      password
    );

    if (!isValidPass) {
      this.logger.warn('LocalStrategy', `Incorrect password!`);
      throw new UnauthorizedException(
        new Result(false, 'Incorrect password!'),
      );
    }

    return person;
  }
}
