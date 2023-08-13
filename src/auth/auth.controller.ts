import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { LocalAuthenticationGuard } from './local.strategy';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserMessage } from '../user/user.message';
import { RequestWithUser } from './auth.interface';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthenticationGuard)
    async login(@Req() request: RequestWithUser, @Res() response: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const user: User = request.user;
            const cookie = this.service.getCookieWithJwtToken(user.id);

            response.setHeader('Set-Cookie', cookie);
            return response.send(user);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() request: RequestWithUser, @Res() response: Response): Promise<Response<any, Record<string, any>>> {
        response.setHeader('Set-Cookie', this.service.getCookieForLogOut());
        return response.sendStatus(HttpStatus.OK);
    }

}
