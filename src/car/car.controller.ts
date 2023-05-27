import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  BearerGuard,
  ParseObjectIdPipe,
  RolesAccess,
  RolesGuard,
} from '../core';
import { CarService } from './car.service';
import { CarDto, CarResponseDto } from './dto';
import { Roles } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @UseGuards(BearerGuard)
  @ApiParam({ required: true, name: 'carId', type: String })
  @ApiOperation({
    description: 'get a car by Id',
    summary: 'get car',
  })
  @ApiResponse({ status: HttpStatus.OK, type: CarResponseDto })
  @Get(':carId')
  private async getCarById(
    @Param('carId', ParseObjectIdPipe) carId,
    @Res() res,
  ): Promise<CarResponseDto> {
    const car = await this.carService.getCarById(carId);

    return res.json(car).status(HttpStatus.OK);
  }

  @UseGuards(BearerGuard)
  @ApiOperation({
    description: 'Get a list of cars',
    summary: 'get cars',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [CarResponseDto] })
  @Get()
  private async getAllCars(@Res() res): Promise<CarResponseDto[]> {
    const cars = await this.carService.getAllCars();

    return res.json(cars).status(HttpStatus.OK);
  }

  @ApiOperation({
    description:
      'create an ad for the sale of a car. If the ad does not pass validation for profanity, this endpoint' +
      ' returns the identifier of the ad. You must insert it at the next request to this endpoint in query called' +
      ' a "editId". if the ad does not pass the profanity check three times, then this ad will not be displayed ',
    summary: 'Create an ad',
  })
  @ApiBody({ type: CarDto, required: true })
  @ApiCreatedResponse()
  @RolesAccess(Roles.ADMIN, Roles.MANAGER, Roles.SELLER)
  @UseGuards(BearerGuard, RolesGuard)
  @ApiQuery({
    required: false,
    description: 'You must insert the id, if this endpoint send you id',
    name: 'editId',
  })
  @Post()
  private async createCar(
    @Body() body: CarDto,
    @Res() res,
    @Req() req,
    @Query('editId') editId,
  ) {
    const info = await this.carService.createCar(body, req.user, editId);

    res
      .status(info ? HttpStatus.UNPROCESSABLE_ENTITY : HttpStatus.CREATED)
      .json(info ? info : HttpStatus.CREATED);
  }

  @UseGuards(BearerGuard)
  @ApiOperation({
    description: 'Upload car photo',
    summary: 'Upload photo',
  })
  @ApiCreatedResponse()
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-photo/:carId')
  private async uploadPhoto(
    @Req() req,
    @Res() res,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('carId', ParseObjectIdPipe) carId: string,
  ): Promise<CarResponseDto[]> {
    await this.carService.uploadPhoto(file, carId, req.user);

    return res.json(HttpStatus.CREATED).status(HttpStatus.CREATED);
  }
}
