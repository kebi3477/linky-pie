import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { LocalAuthenticationGuard } from './local.strategy';
import { AuthService } from './auth.service';
import { Response, response } from 'express';
import { UserMessage } from '../user/user.message';
import { GoogleRequest, KakaoRequest, NaverRequest, RequestWithUser } from './auth.interface';
import { User } from '../user/user.entity';
import { KakaoStrategy } from './kakao.strategy';
import { AuthGuard } from '@nestjs/passport';

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

    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoAuth(@Req() req: KakaoRequest) {}

    @Get('/kakao/redirect')
    @UseGuards(AuthGuard('kakao'))
    async kakaoRedirect(@Req() req: KakaoRequest, @Res() response: Response) {
        try {
            const cookie = await this.service.kakaoLogin(req);

            response.setHeader('Set-Cookie', cookie);
            response.redirect('/');
            return response.send(req);
        } catch (error) {
            throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: GoogleRequest) {}

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req: GoogleRequest, @Res() response: Response) {
        try {
            const cookie = await this.service.googleLogin(req);

            response.setHeader('Set-Cookie', cookie);
            response.redirect('/');
            return response.send(req);
        } catch (error) {
            throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/naver')
    @UseGuards(AuthGuard('naver'))
    async naverAuth(@Req() req: NaverRequest) {}

    @Get('/naver/redirect')
    @UseGuards(AuthGuard('naver'))
    async naverRedirect(@Req() req: NaverRequest, @Res() response: Response) {
        try {
            const cookie = await this.service.naverLogin(req);

            response.setHeader('Set-Cookie', cookie);
            response.redirect('/');
            return response.send(req);
        } catch (error) {
            throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}