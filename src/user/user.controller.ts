import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserResponseDto } from './user.dto';
import { User } from '../user/user.entity';
import { UserMessage } from './user.message';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { FollowerMessage } from '../follower/follower.message';

@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO) {
        try {
            const newUser: User = await this.service.create(createUserDTO);
            const result: UserResponseDto<User> = new UserResponseDto();

            return result.set(HttpStatus.CREATED, UserMessage.SUCCESS_CREATE, newUser);
        } catch (error) {
            if (error.message === UserMessage.CONFLICT) {
                throw new HttpException(UserMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get('/me')
    @UseGuards(JwtAuthenticationGuard)
    async readMe(@Req() request: RequestWithUser) {
        try {
            const user = request.user;
            const result: UserResponseDto<User> = new UserResponseDto();
            
            user.password = undefined;
            return result.set(HttpStatus.OK, UserMessage.SUCCESS_READ, user);
        } catch (error) {
            throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/follow/:follow_id')
    @UseGuards(JwtAuthenticationGuard)
    async followUser(@Req() request: RequestWithUser, @Param('follow_id') followId: string) {
        try {
            const user: User = await this.service.followUser(request.user.id, followId);
            const result: UserResponseDto<User> = new UserResponseDto();

            return result.set(HttpStatus.OK, UserMessage.SUCCESS_FOLLOW, user);
        } catch (error) {
            if (error.message === FollowerMessage.CONFLICT) {
                throw new HttpException(FollowerMessage.CONFLICT, HttpStatus.CONFLICT);
            } else if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
  
    @Delete('/unfollow/:follow_id')
    @UseGuards(JwtAuthenticationGuard)
    async unfollowUser(@Req() request: RequestWithUser, @Param('follow_id') followId: string) {
        try {
            const user: User = await this.service.unfollowUser(request.user.id, followId);
            const result: UserResponseDto<User> = new UserResponseDto();

            return result.set(HttpStatus.OK, UserMessage.SUCCESS_UNFOLLOW, user);
        } catch (error) {
            if (error.message === FollowerMessage.CONFLICT) {
                throw new HttpException(FollowerMessage.CONFLICT, HttpStatus.CONFLICT);
            } else if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
  
    @Get('/followers')
    @UseGuards(JwtAuthenticationGuard)
    async getFollowers(@Req() request: RequestWithUser) {
        try {
            const users: User[] = await this.service.getFollowers(request.user.id);
            const result: UserResponseDto<User[]> = new UserResponseDto();

            return result.set(HttpStatus.OK, UserMessage.SUCCESS_READ, users);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
  
    @Get('/followings')
    @UseGuards(JwtAuthenticationGuard)
    async getFollowing(@Req() request: RequestWithUser) {
        try {
            const users: User[] = await this.service.getFollowing(request.user.id);
            const result: UserResponseDto<User[]> = new UserResponseDto();

            return result.set(HttpStatus.OK, UserMessage.SUCCESS_READ, users);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
