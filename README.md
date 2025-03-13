<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# <center>**Backend NestJS/AWS | Challenge**</center>

## 1. Instalación de componentes globales

### 1.1. AWS CLI
Instala el [**AWS CLI**](https://aws.amazon.com/es/cli/) en tu computadora y configura el entorno con el siguiente comando:

```bash
aws config
```

Tienes que ingresar los datos proporcionados por AWS
```bash
aws_access_key_id=<TODO>
aws_secret_access_key=<TODO>
```

### 1.2. Instalar Serverless
Si no tienes instalado Serverless, se recomienda hacer la instalación de forma global con el siguiente comando:

```bash
npm i -g serverless
```

### 1.3. Instalar NestJS
Se recomienda instalar NestJS de forma global con el siguiente comando:

```bash
npm i -g @nestjs/cli
```

## 2. Instalación de dependencias externas

### 2.1 Instalar Redis
Instala [**Redis para Windows**](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/) en tu computadora siguiendo los pasos que recomienda su página oficial.

### 2.2 Iniciar Redis desde Ubuntu
Si no se ha instalado el WSL (Windows Subsystem for Linux), se recomienda seguir los pasos de instalación del siguiente enlace que proporciona [**Windows**](https://learn.microsoft.com/en-us/windows/wsl/install).

Una vez que se tenga iniciado el WSL de Ubuntu, ejecutar el siguiente comando:

```bash
# iniciar redis
sudo service redis-server start

# parar redist
sudo service redis-server stop
```

Para validar que en efecto Redis este ejecutándose correctamente ejecutamos el siguiente comando:

```bash
redis-cli
```

Validamos escribiendo la palabra <code>**ping**</code> en la consola y nos tiene que retornar la palabra <code>**PONG**</code>

Ejemplo:

![Redis](/images/1_redis_command.png)

### 2.3 Instala Docker Desktop
En mi caso, estoy trabajando con [**Docker Desktop**](https://docs.docker.com/desktop/setup/install/windows-install/), otra opción seria usar [**Podman**](https://podman.io/get-started)

### 2.4 Configuración de archivo YML
Dado que es necesario tener Redis iniciado dentro del contenedor de Docker, estoy usando este archivo YML.

```yml
services:
  redis:
    container_name: redis
    image: redis:7.4.2
    ports:
      - "6379:6379"
    volumes:
      - redis:/data

volumes:
  redis:
```

Tenemos que iniciar el contenedor de redis con el siguiente comando
```bash
docker-compose up -d redis
```

Para detener el contenedor, ejecutar el siguiente comando
```bash
docker-compose stop redis
```

Ejemplo:

![Redis](/images/2_redis_docker.png)

## 3. Iniciar proyecto

### 3.1 Instalación
Instalar los paquetes, módulos y librerías necesarias para ejecutar el proyecto

```bash
$ npm install
```

### 3.2 Compilar y ejecutar el proyecto

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### 3.3 Ejecutar test unitarios y convergencia

```bash
# unit tests
$ npm run test:watch

# test coverage
$ npm run test:cov
```

## 4. Descripción del reto técnico

### 4.1 Pruebas unitarias

**Unit Test**

![Instalación](/images/3_unit_test.png)

**Coverage Test**

![Instalación](/images/4_cov_test.png)

### 4.2 Uso de TypeScript
Este proyecto está construido con TypeScript, dado que NestJS es totalmente compatible.

### 4.3 Se generaron 3 enpoints
A continuación, se detallan las rutas de los 3 endpoints:

#### 4.3.1 Fusion
Obtiene los datos fusionados de las apis externas

```
http://localhost:3000/customs/fusion/5
```

#### 4.3.2 Resources
Guarda datos propios de la base de datos
```
http://localhost:3000/customs/resources
```

#### 4.3.2 History
Obtiene el historial de consultas por página y límite, ordenado por fecha
```
http://localhost:3000/customs/history?page=1&limit=10
```

### 4.4 Cacheo de resultados
Se está usando Redis y la librería <code>@keyv/redis</code> para el cacheo de resultados, configurando un intervalo de 30 minutos

#### 4.4.1 Configuración
Configuración de variables de entorno
```env
REDIS_URL=127.0.0.1
REDIS_PORT=6379
REDIS_TTL=30m
```

En <code>\infrastructure\config\enviroment.config.ts</code> agregamos
```typescript
  redis: {
    url: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    ttl: process.env.REDIS_TTL
  }
```

En <code>\infrastructure\common\strategies\enviroment.strategy.ts</code> implementamos <code>RedisConfig.ts</code>
```typescript
  getRedisUrl(): string {
    return this.configService.get<string>('redis.url') || '';
  }

  getRedisPort(): number {
    return this.configService.get<number>('redis.port') || 6379;
  }

  getRedisTtl(): string {
    return this.configService.get<string>('redis.ttl') || '30m';
  }
```

Creamos el modulo <code>redis.module</code> dentro de <code>\infrastructure\config</code>
```typescript
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { EnviromentConfigModule } from './enviroment.module';
import { CACHE_INSTANCE } from '@core';
import { RedisService } from '@infrastructure/services/redis/redis.service';
import { EnviromentStrategy } from '@infrastructure/common/strategies/enviroment.strategy';

@Module({
  imports: [EnviromentConfigModule],
  providers: [
    {
      provide: CACHE_INSTANCE,
      inject: [EnviromentStrategy, ConfigService],
      useFactory: async (config: EnviromentStrategy) => {
        const redisUrl = `redis://${config.getRedisUrl()}:${config.getRedisPort()}`;
        const secondary = new KeyvRedis(redisUrl);
        return new Cacheable({ secondary, ttl: config.getRedisTtl() });
      },
    },
    RedisService,
  ],
  exports: [CACHE_INSTANCE, RedisService],
})
export class RedisModule {}
```

Se muestra la consulta a la memoria cache.

![Instalación](/images/13_redis_show.png)

### 4.5 Despliegue en AWS usando Serverless

En mi caso, estoy usando la carpeta <code>dist</code> para leer los archivos compilados, por ello, antes de cada despliegue **offline** o hacia **AWS** recomiendo ejecutar el comando:

>Importante

```bash
npm run build
```

#### 4.5.1 Despliegue offline
Para hacer pruebas antes del pliegue a AWS, en mi caso estoy validando de manera fuera de línea (offline) con el siguiente comando

```bash
serverless offline
```

![Instalación](/images/5_serverless_offline.png)

#### 4.5.2 Despliegue en AWS
Ejecutamos el despliegue en AWS con el siguiente comando


```bash
serverless deploy
```

![Instalación](/images/5_serverless_deploy.png)

#### 4.5.3 Instalación de Layer (capa)
Esta opción también se recomienda para disminuir costos al momento de desplegar el Lambda.
Si el proyecto NestJS que se genera es muy grande, se necesita instalar e instanciar una capa a la función Lambda, se pueden guiar del siguiente [**enlace**](https://aditya4.medium.com/cannot-use-import-statement-outside-module-nodejs-runtime-with-aws-lambda-de48bbc47e92). 

#### 4.5.4 Instalar Redis en AWS
Para no entrar en detalles, Redis necesita un Cluster en AWS para que almacene los datos en una memoria.
Es recomendable seguir la documentación de AWS para este caso en el siguiente [**enlace**](https://aws.amazon.com/es/blogs/database/access-amazon-memorydb-for-redis-from-aws-lambda/)

#### 4.5.5 Validación y corrección de errores
Para validar que se esté desplegando correctamente el proyecto en AWS, validamos CloudWatch.

![Instalación](/images/7_cloudwatch.png)

En mi caso, tengo un error, no está detectando algunas librerías que se han instalado. Es por ello que recomiendo crear una capa como detalle en el punto **4.4.3**.

Luego de solucionar el error, podemos validar en la siguiente ruta que Swagger cargue correctamente:

```
https://hfbbzs4s31.execute-api.us-west-2.amazonaws.com/development/api/
```

El resultado al corregir los errores debe mostrarse así:

![Instalación](/images/8_lambda_swagger.png)

### 4.6 Almacenamiento en DynamoDB
Estoy usando 2 tablas, History y Person para guardar los datos en DynamoDB.\
Recomiendo crear ambas tablas antes de hacer consultas, y tambien usar el siguiente endpoint para crear un usuario:

```
http://localhost:3000/persons
```

```json
{
  "username": "juanperez",
  "firstName": "Juan",
  "lastName": "Perez",
  "email": "juanperez@gmail.com",
  "password": "123456"
}
```

![Instalación](/images/6_dynamodb.png)

### 4.7 Uso de AWS Lambday API Gateway
Se esta usando AWS Lambda y API Gateway.

![Instalación](/images/12_aws_lambda.png)

## 5. Puntos bonus

### 5.1 JWT
Se está usando JWT para proteger y autenticar los endpoints, se implementaron las siguientes clases:

```
\infrastructure\services\auth\auth.module.ts
\infrastructure\common\strategies\jwt.strategy.ts
\infrastructure\common\strategies\local.strategy.ts
```

Para el caso del reto técnico, se han configurado los endpoints de los siguientes controladores:

<code>persons.controller.ts</code>

```typescript
  @ApiBearerAuth() // Indica que no se puede ingresar sin una autorización
  @ApiResponse({ description: "Find all persons", isArray: true, type: PersonEntity })
  @ApiOperation({ summary: 'Find all persons' })
  @UseGuards(JwtAuthGuard) // Valida la autorización
  @Get()
  async findAll(): Promise<Result> {
    return await this.personServiceInterface.findAll();
  }
```

<code>auth.controller.ts</code>

```typescript
  @Post('login')
  @UseGuards(LocalAuthGuard) // valida la autorización
  @ApiBody({ type: AuthDto })
  @ApiOperation({ summary: 'Login user into the system' })
  async login(@Body() authDto: AuthDto): Promise<HttpException | Result> {
    const result: HttpException | Result = await this.authServiceInterface.login(authDto);
    return result;
  }
```

### 5.2 Swagger/OpenAPI
Se han documentado los endpoints de forma local; así como también, el Lambda usando Swagger/OpenAPI.

![Instalación](/images/9_local_swagger.png)

### 5.3 Uso de AWS CloudWatch
Se usa AWS CloudWatch para rastrear errores y rendimiento

![Instalación](/images/10_cloudwatch_all.png)

### 5.4 Implementación de rate-limiting
Para evitar el abuso de consumo de endpoints se implementó en el proyecto la librería de NestJS <code>@nestjs/throttler</code>.\
La configuración se hizo en el archivo <code>rate-limiter.module.ts</code>

![Instalación](/images/11_rate_limiter.png)

### 5.5 Prácticas recomendadas
Para disminuir costos en el Lambda, estoy usando Layer (capas), esto reduce el tamaño de packete que se despliega, también reduce el tiempo de despliegue.

También, se puede hacer ajustes en la configuración básica de la función lambda indicando la cantidad de memoria a usar, el almacenamiento afímero y el tiempo de espera.