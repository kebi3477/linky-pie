import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserResponseDto, RequestWithUser } from './user.dto';
import { User } from 'src/entity/user.entity';
import { UserMessage } from './user.message';
import { LocalAuthenticationGuard } from '../auth/local.strategy';
import { JwtAuthenticationGuard } from 'src/auth/jwt.strategy';
import { Response } from 'express';

@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO) {
        try {
            const newUser: User = await this.service.create(createUserDTO);
            const result: UserResponseDto = new UserResponseDto();

            return result.set(HttpStatus.CREATED, UserMessage.SUCCESS_CREATE, newUser);
        } catch (error) {
            if (error.message === UserMessage.CONFLICT) {
                throw new HttpException(UserMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthenticationGuard)
    async login(@Req() request: RequestWithUser, @Res() response: Response) {
        try {
            const user = request.user;
            const cookie = this.service.getCookieWithJwtToken(user.id);
            const result: UserResponseDto = new UserResponseDto();

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

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        const result: UserResponseDto = new UserResponseDto();
        
        user.password = undefined;
        return result.set(HttpStatus.OK, UserMessage.SUCCESS_READ, user);
    }

    @Post('logout')
    async logout(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.service.getCookieForLogOut());
        return response.sendStatus(HttpStatus.OK);
    }

}
