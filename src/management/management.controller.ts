import {
  Controller,
  HttpStatus,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { BearerGuard, RolesAccess, RolesGuard } from '../core';
import { ManagementService } from './management.service';
import { Roles } from '@prisma/client';
@ApiTags('management')
@Controller('management')
@UseGuards(BearerGuard, RolesGuard)
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @RolesAccess(Roles.MANAGER, Roles.ADMIN)
  @ApiParam({ required: true, name: 'userId', type: String })
  @ApiOperation({
    description: 'Only admin and manager can use this endpoint',
    summary: 'ban user',
  })
  @ApiNoContentResponse()
  @Put('ban/:userId')
  private async banUser(@Res() res, @Param('userId') userId: string) {
    await this.managementService.banUser(userId);

    return res.status(HttpStatus.NO_CONTENT).sendStatus(HttpStatus.NO_CONTENT);
  }

  @RolesAccess(Roles.MANAGER, Roles.ADMIN)
  @ApiParam({ required: true, name: 'userId', type: String })
  @ApiOperation({
    description: 'Only admin and manager can use this endpoint',
    summary: 'unban user',
  })
  @ApiNoContentResponse()
  @Put('unban/:userId')
  private async unbanUser(@Res() res, @Param('userId') userId: string) {
    await this.managementService.unbanUser(userId);

    return res.status(HttpStatus.NO_CONTENT).sendStatus(HttpStatus.NO_CONTENT);
  }
}
