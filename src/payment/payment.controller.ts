import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto';
import { BearerGuard, RolesAccess, RolesGuard } from '../core';
import { Roles } from '@prisma/client';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(BearerGuard, RolesGuard)
  @RolesAccess(Roles.ADMIN, Roles.MANAGER, Roles.SELLER)
  @ApiBody({ required: true, type: PaymentDto })
  @ApiOperation({ description: 'buy premium', summary: 'buy premium' })
  @ApiOkResponse()
  @Post()
  private async buyPremiumAccount(
    @Body() body: PaymentDto,
    @Res() res,
    @Req() req,
  ) {
    await this.paymentService.buyPremiumAccount(body, req.user);

    return res.status(HttpStatus.ACCEPTED).sendStatus(HttpStatus.ACCEPTED);
  }
}
