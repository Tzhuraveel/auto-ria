import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StatisticService } from './statistic.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  BearerGuard,
  ParseObjectIdPipe,
  PremiumGuard,
  RolesAccess,
  RolesGuard,
} from '../core';
import { Roles } from '@prisma/client';
import { AveragePriceResponseDto, StatisticViewResponseDto } from './dto';

@ApiTags('statistic')
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @UseGuards(BearerGuard, RolesGuard, PremiumGuard)
  @RolesAccess(Roles.ADMIN, Roles.SELLER, Roles.MANAGER)
  @ApiParam({ required: true, name: 'carId' })
  @ApiOperation({
    summary: 'get number of views',
    description:
      'get information about ad views. Only premium users can use this endpoint',
  })
  @ApiOkResponse({ type: StatisticViewResponseDto })
  @Get('views/:carId')
  private async getViewsStatistic(
    @Res() res,
    @Req() req,
    @Param('carId', ParseObjectIdPipe) carId,
  ) {
    const views = await this.statisticService.getViewsStatistic(
      carId,
      req.user,
    );

    return res.json(views).status(HttpStatus.OK);
  }

  @UseGuards(BearerGuard, RolesGuard, PremiumGuard)
  @RolesAccess(Roles.ADMIN, Roles.SELLER, Roles.MANAGER)
  @ApiParam({ required: true, name: 'carId' })
  @ApiOperation({
    summary: 'Get the average price for a car in the city',
    description:
      'Get the average price of a car in the city. Only premium users can use this endpoint',
  })
  @ApiOkResponse({ type: AveragePriceResponseDto })
  @Get('average-price/:carId')
  private async getAveragePriceByCity(
    @Res() res,
    @Req() req,
    @Param('carId', ParseObjectIdPipe) carId,
  ) {
    const averagePrice = await this.statisticService.getAveragePriceForCity(
      carId,
    );

    return res.json(averagePrice).status(HttpStatus.OK);
  }

  @UseGuards(BearerGuard, RolesGuard, PremiumGuard)
  @RolesAccess(Roles.ADMIN, Roles.SELLER, Roles.MANAGER)
  @ApiOperation({
    summary: 'Get the average price for Ukraine',
    description:
      'Get the average price for Ukraine. Only premium users can use this endpoint',
  })
  @ApiOkResponse({ type: AveragePriceResponseDto })
  @Get('average-price')
  private async getAveragePriceByUkraine(@Res() res) {
    const averagePrice =
      await this.statisticService.getAveragePriceForUkraine();

    return res.json(averagePrice).status(HttpStatus.OK);
  }
}
