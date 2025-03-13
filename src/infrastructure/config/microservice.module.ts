import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { EnviromentConfigModule } from './enviroment.module';
import { EnviromentStrategy } from '@infrastructure/common/strategies/enviroment.strategy';

const microserviceModule: DynamicModule = HttpModule.registerAsync({
  imports: [EnviromentConfigModule],
  inject: [EnviromentStrategy],
  useFactory: async (config: EnviromentStrategy) => ({
    timeout: config.getHttpTimeout(),
    maxRedirects: config.getHttpMaxRedirects(),
  }),
});

@Module({
  imports: [microserviceModule],
  exports: [microserviceModule],
})
export class MicroserviceConfigModule {}
