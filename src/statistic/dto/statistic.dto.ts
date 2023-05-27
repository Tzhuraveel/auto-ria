import { ApiProperty } from '@nestjs/swagger';

export class StatisticViewResponseDto {
  @ApiProperty({
    required: true,
    type: String,
    example: '646ddec5b8989d4f7be8d70e',
  })
  id: string;

  @ApiProperty({
    required: true,
    type: Number,
    example: 1,
  })
  dayViews: number;

  @ApiProperty({
    required: true,
    type: Number,
    example: 1,
  })
  monthViews: number;

  @ApiProperty({
    required: true,
    type: Number,
    example: 1,
  })
  totalViews: number;

  @ApiProperty({
    required: true,
    type: String,
    example: '646ddec5b8989d4f7be8d70e',
  })
  carId: string;
}

export class AveragePriceResponseDto {
  @ApiProperty({ required: true, type: Number, example: 2300 })
  averagePrice: number;

  @ApiProperty({ required: true, type: String, example: 'USD' })
  currency: string;
}
