import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, response } from 'express';
import { RequestWithUser, SocialRequest } from './auth.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoAuth(@Req() req: SocialRequest) {}

    @Get('/kakao/redirect')
    @UseGuards(AuthGuard('kakao'))
    async kakaoRedirect(@Req() req: SocialRequest, @Res() response: Response) {
        const cookie = await this.service.kakaoLogin(req);

        response.setHeader('Set-Cookie', cookie);
        response.redirect('/');

        return response.send(req);
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: SocialRequest) {}

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req: SocialRequest, @Res() response: Response) {
        const cookie = await this.service.googleLogin(req);

        response.setHeader('Set-Cookie', cookie);
        response.redirect('/');

        return response.send(req);
    }

    @Get('/naver')
    @UseGuards(AuthGuard('naver'))
    async naverAuth(@Req() req: SocialRequest) {}

    @Get('/naver/redirect')
    @UseGuards(AuthGuard('naver'))
    async naverRedirect(@Req() req: SocialRequest, @Res() response: Response) {
        const cookie = await this.service.naverLogin(req);

        response.setHeader('Set-Cookie', cookie);
        response.redirect('/');

        return response.send(req);
    }

    @Get('/logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: RequestWithUser, @Res() response: Response): Promise<Response<any, Record<string, any>>> {
        const cookie = this.service.getCookieForLogOut();

        response.setHeader('Set-Cookie', cookie);
        response.redirect('/');

        return response.send(req);
    }
}