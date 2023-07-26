import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserResponseDto } from './user.dto';
import { User } from 'src/entity/user.entity';
import { UserMessage } from './user.message';

@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO) {
        try {
            const newUser: User = await this.service.create(createUserDTO);
            const result: UserResponseDto = new UserResponseDto();

            return result.setStatusCode(HttpStatus.CREATED)
                         .setMessage(UserMessage.SUCCESS_CREATE)
                         .setUser(newUser);
        } catch (error) {
            if (error.message === UserMessage.CONFLICT) {
                throw new HttpException(UserMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post('/login')
    async login(@Body('id') id: string, @Body('password') password: string) {
        try {
            const user: User = await this.service.login(id, password);
            const result: UserResponseDto = new UserResponseDto();

            return result.setStatusCode(HttpStatus.OK)
                         .setMessage(UserMessage.SUCCESS_LOGIN)
                         .setUser(user);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
