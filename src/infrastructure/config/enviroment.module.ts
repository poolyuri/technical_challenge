import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { enviromentConfig } from "./enviroment.config";
import { validationConfig } from "./validation.config";
import { EnviromentStrategy } from "../common/strategies/enviroment.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [
        enviromentConfig
      ],
      validationSchema: validationConfig
    })
  ],
  providers: [EnviromentStrategy],
  exports: [EnviromentStrategy]
})
export class EnviromentConfigModule {}