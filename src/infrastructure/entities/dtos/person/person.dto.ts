import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreatePersonDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;
  
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  isActive?: boolean = true;
};

export class CreatedPersonDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  @Exclude()
  password: string;
};

export class UpdatePersonDto extends OmitType(CreatePersonDto, ['password' as const]) {};
