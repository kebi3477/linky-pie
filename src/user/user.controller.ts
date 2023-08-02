import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserResponseDto } from './user.dto';
import { User } from 'src/entity/user.entity';
import { UserMessage } from './user.message';
import { JwtAuthenticationGuard } from 'src/auth/jwt.strategy';
import { RequestWithUser } from 'src/auth/auth.interface';

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

    @Get('/me')
    @UseGuards(JwtAuthenticationGuard)
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        const result: UserResponseDto = new UserResponseDto();
        
        user.password = undefined;
        return result.set(HttpStatus.OK, UserMessage.SUCCESS_READ, user);
    }

    @Post(':userId/follow/:followingUserId')
    followUser(
        @Param('userId') userId: string,
        @Param('followingUserId') followingUserId: string,
    ): Promise<void> {
        return this.service.followUser(userId, followingUserId);
    }
  
    @Delete(':userId/unfollow/:followingUserId')
    unfollowUser(
        @Param('userId') userId: string,
        @Param('followingUserId') followingUserId: string,
    ): Promise<void> {
        return this.service.unfollowUser(userId, followingUserId);
    }
  
    @Get(':userId/followers')
    getFollowers(@Param('userId') userId: string): Promise<User[]> {
        return this.service.getFollowers(userId);
    }
  
    @Get(':userId/following')
    getFollowing(@Param('userId') userId: string): Promise<User[]> {
        return this.service.getFollowing(userId);
    }
}
