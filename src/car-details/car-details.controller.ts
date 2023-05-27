import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarDetailsService } from './car-details.service';
import { MarkaCar, ModelCar, Roles } from '@prisma/client';
import {
  BearerGuard,
  ParseObjectIdPipe,
  RolesAccess,
  RolesGuard,
} from '../core';
import { CarMarkaDto, CarModelDto } from './dto';

@ApiTags('car-details')
@Controller('car-details')
export class CarDetailsController {
  constructor(private readonly carDetailService: CarDetailsService) {}

  @ApiOperation({ description: 'Get all marks', summary: 'Get all marks' })
  @Get('marka')
  private async getAllCarMarks(@Res() res): Promise<MarkaCar[]> {
    const marks = await this.carDetailService.getAllCarMarks();

    return res.status(HttpStatus.OK).json(marks);
  }

  @ApiOperation({
    description: 'Get all models by marka id',
    summary: 'Get all models',
  })
  @Get('model/:markaId')
  @ApiOkResponse()
  private async getAllCarModels(
    @Res() res,
    @Param('markaId', ParseObjectIdPipe) markaId,
  ): Promise<ModelCar[]> {
    const models = await this.carDetailService.getAllCarModels(markaId);

    return res.status(HttpStatus.OK).json(models);
  }

  @UseGuards(BearerGuard, RolesGuard)
  @RolesAccess(Roles.MANAGER, Roles.SELLER, Roles.ADMIN)
  @ApiOperation({
    description: 'inform the administrator about which model is missing',
  })
  @ApiBody({ required: true, type: CarModelDto })
  @ApiOkResponse()
  @Post('add-car-model')
  private async addCarModel(@Req() req, @Body() body: CarModelDto, @Res() res) {
    await this.carDetailService.addCarModel(body);

    return res.status(HttpStatus.ACCEPTED).sendStatus(HttpStatus.ACCEPTED);
  }

  @UseGuards(BearerGuard, RolesGuard)
  @RolesAccess(Roles.MANAGER, Roles.SELLER, Roles.ADMIN)
  @ApiOperation({
    description: 'inform the administrator about which marka is missing',
  })
  @ApiBody({ required: true, type: CarModelDto })
  @ApiOkResponse()
  @Post('add-car-marka')
  private async addCarMarka(@Req() req, @Body() body: CarMarkaDto, @Res() res) {
    await this.carDetailService.addCarMarka(body);

    return res.status(HttpStatus.ACCEPTED).sendStatus(HttpStatus.ACCEPTED);
  }
}
