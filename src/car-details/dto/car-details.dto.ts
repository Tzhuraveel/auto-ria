import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { regexExpression } from '../../core';
import { Transform } from 'class-transformer';

export class CarModelResponseDto {
  @ApiProperty({
    required: true,
    type: String,
    example: '646ddec5b8989d4f7be8d70e',
  })
  id: string;

  @ApiProperty({ required: true, type: String, example: 'X5' })
  model: string;

  @ApiProperty({ required: true, type: String, example: 'BMW' })
  marka: string;
}

export class CarMarkaResponseDto {
  @ApiProperty({
    required: true,
    type: String,
    example: '646ddec5b8989d4f7be8d70e',
  })
  id: string;
  @ApiProperty({ required: true, type: String, example: 'BMW' })
  marka: string;
}

export class CarModelDto {
  @ApiProperty({
    required: true,
    type: String,
    example: '646ddec5b8989d4f7be8d70e',
  })
  @IsMongoId()
  markaId: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'BMW',
  })
  @IsNotEmpty()
  @IsString()
  markaName: string;

  @ApiProperty({ required: true, type: String, example: 'X6' })
  @Length(2, 50)
  @IsString()
  @IsNotEmpty()
  modelName: string;

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
  userEmail: string;

  @ApiProperty({ required: true, type: String, example: 'Тимофій Журавель' })
  @IsString()
  @Length(2, 100)
  userName: string;
}

export class CarMarkaDto extends OmitType(CarModelDto, ['markaId'] as const) {}
