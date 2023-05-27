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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { EmailDto, LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { MailGuard } from '../core/mail/mailToken.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    description:
      'Takes an email address and sends a message to your email address to verify that it`s your email address.' +
      ' This allows you to continue your registration',
    summary: 'send a register message to an email address',
  })
  @ApiBody({
    type: EmailDto,
    required: true,
  })
  @ApiOkResponse({ description: 'Message was sent to your email' })
  @Post('sendMail')
  public async sendMail(@Body() body: EmailDto, @Res() res): Promise<Response> {
    await this.authService.sendMail(body.email);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Message was sent to your email' });
  }

  @ApiOperation({
    description:
      "Сonfirming that the token is valid and returns the user's email ",
    summary: 'Takes a token and sends email',
  })
  @ApiParam({ name: 'token', type: String, required: true })
  @ApiOkResponse({ type: EmailDto })
  @Get('email/:token')
  public async getDataByToken(
    @Param('token') param,
    @Res() res,
  ): Promise<Response> {
    const data = await this.authService.getDataByToken(param);
    return res.status(HttpStatus.OK).json(data);
  }

  @ApiOperation({
    description:
      'Before this request, you need to make a request for email/:token and that way you will receive' +
      ' an' +
      ' email' +
      ' address of user. You need to send this email together with the data written by the User ,',
    summary: 'Register user',
  })
  @ApiParam({ name: 'token', type: String, required: true })
  @ApiBody({ type: RegisterDto, required: true })
  @ApiCreatedResponse()
  @UseGuards(MailGuard)
  @Post('register/:token')
  public async register(
    @Req() req,
    @Body() body: RegisterDto,
    @Param('token') param,
    @Res() res,
  ): Promise<Response> {
    await this.authService.register(body, param, req.userEmail);
    return res.status(HttpStatus.CREATED).sendStatus(HttpStatus.CREATED);
  }

  @ApiOperation({
    description:
      'Takes a set of user credentials and returns an access JSON web\n' +
      'token to prove the authentication of those credentials.',
    summary: 'Login user',
  })
  @Post('login')
  public async login(@Body() body: LoginDto, @Res() res): Promise<Response> {
    const token = await this.authService.login(body.email, body.password);

    return res.status(HttpStatus.OK).json({ accessToken: token });
  }
}
