import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserResponseDto, RequestWithUser } from './user.dto';
import { User } from 'src/entity/user.entity';
import { UserMessage } from './user.message';
import { JwtAuthenticationGuard } from 'src/auth/jwt.strategy';

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

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        const result: UserResponseDto = new UserResponseDto();
        
        user.password = undefined;
        return result.set(HttpStatus.OK, UserMessage.SUCCESS_READ, user);
    }
}
