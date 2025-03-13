import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FusionEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  birth_year: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name_planet: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  climate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  weather: string;

  constructor(
    name: string,
    gender: string,
    birth_year: string,
    name_planet: string,
    climate: string,
    weather: string,
  ) {
    this.name = name;
    this.gender = gender;
    this.birth_year = birth_year;
    this.name_planet = name_planet;
    this.climate = climate;
    this.weather = weather;
  }
}
