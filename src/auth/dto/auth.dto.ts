import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { regexExpression } from '../../core';

export class RegisterDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'Timofii Zhuravel',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(2, 30)
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'zhuraveltimofiy2003@gmail.com',
    pattern: `${regexExpression.EMAIL}`,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Matches(regexExpression.EMAIL)
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '234Fsfe3#',
    pattern: `${regexExpression.PASSWORD}`,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Matches(regexExpression.PASSWORD)
  password: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '+380632546437',
    pattern: `${regexExpression.PHONE}`,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Matches(regexExpression.PHONE)
  phone: string;

  @ApiProperty({
    required: true,
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isBuyer: boolean;
}

export class LoginDto extends PickType(RegisterDto, [
  'email',
  'password',
] as const) {}

export class EmailDto extends PickType(RegisterDto, ['email'] as const) {}
