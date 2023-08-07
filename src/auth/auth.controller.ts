import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { UserResponseDto } from 'src/user/user.dto';
import { LocalAuthenticationGuard } from './local.strategy';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserMessage } from 'src/user/user.message';
import { RequestWithUser } from './auth.interface';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthenticationGuard)
    async login(@Req() request: RequestWithUser, @Res() response: Response) {
        try {
            const user: User = request.user;
            const cookie = this.service.getCookieWithJwtToken(user.id);
            const result: UserResponseDto<User> = new UserResponseDto();

            response.setHeader('Set-Cookie', cookie);
            user.password = undefined;
            return response.send(result.set(HttpStatus.OK, UserMessage.SUCCESS_LOGIN, user))
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post('logout')
    async logout(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.service.getCookieForLogOut());
        return response.sendStatus(HttpStatus.OK);
    }

}
