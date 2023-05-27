import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty({ required: true, example: '4441 3434 2343 2342' })
  @IsNotEmpty()
  @IsString()
  card: string;

  @ApiProperty({ required: true, example: '12/34' })
  @IsNotEmpty()
  @IsString()
  expirationDate: string;

  @ApiProperty({ required: true, example: '232' })
  @IsNotEmpty()
  @IsString()
  cvv: string;
}
