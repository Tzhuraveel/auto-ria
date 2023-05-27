import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CurrencyCar, Prisma } from '@prisma/client';

export class CarDto {
  @ApiProperty({ required: true, type: String, example: 'BMW' })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  marka: string;

  @ApiProperty({ required: true, type: String, example: 'X5' })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ required: true, type: String, example: 'car top' })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @Length(50, 2000)
  description: string;

  @ApiProperty({ required: true, type: Number, example: 1990 })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsNotEmpty()
  year: number;

  @ApiProperty({ required: true, type: Number, example: 2500 })
  @IsInt()
  @Min(0.1)
  @Max(500000000)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true, type: Number, example: 2.5 })
  @Min(0.1)
  @Max(5)
  @IsNotEmpty()
  engine: number;

  @ApiProperty({ required: true, type: String, example: 'Lviv' })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  cityLocative: string;

  @ApiProperty({ required: true, enum: CurrencyCar, example: 'USD' })
  @Transform(({ value }) => value.trim())
  @IsEnum(CurrencyCar)
  @IsNotEmpty()
  currency: CurrencyCar;
}

export class CarResponseDto {
  @ApiProperty({
    required: true,
    type: String,
    example: '646ddec5b8989d4f7be8d70e',
  })
  id: string;

  @ApiProperty({ required: true, type: Number, example: 1990 })
  year: number;

  @ApiProperty({ required: true, type: Number, example: 6579 })
  EUR: number;

  @ApiProperty({ required: true, type: Number, example: 7500 })
  USD: number;

  @ApiProperty({ required: true, type: Number, example: 276968 })
  UAH: number;

  @ApiProperty({ required: true, type: String, example: 'USD' })
  currency: string;

  @ApiProperty({
    required: true,
    type: Object,
    example: { sale: 35.43, buy: 35.43 },
  })
  eurRate: Prisma.JsonValue;

  @ApiProperty({
    required: true,
    type: Object,
    example: { sale: 35.43, buy: 35.43 },
  })
  usdRate: Prisma.JsonValue;

  @ApiProperty({ required: true, type: Number, example: 2.5 })
  engine: number;

  @ApiProperty({ required: true, type: String, example: 'Lviv' })
  cityLocative: string;

  @ApiProperty({ required: true, type: String, example: 'car top' })
  description: string;

  @ApiProperty({ required: false, type: String, example: 'some link' })
  @IsOptional()
  photo?: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '646ddec5b8989d4f7be8d70e',
  })
  ownerId: string;

  @ApiProperty({ required: true, type: String, example: 'BMW' })
  marka: string;

  @ApiProperty({ required: true, type: String, example: 'X5' })
  model: string;
}
