import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserResponseDto } from './user.dto';
import { User } from 'src/user/user.entity';
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

    @Post('/follow/:followingUserId')
    @UseGuards(JwtAuthenticationGuard)
    followUser(
        @Req() request: RequestWithUser,
        @Param('followingUserId') followingUserId: string,
    ): Promise<void> {
        return this.service.followUser(request.user.id, followingUserId);
    }
  
    @Delete(':userId/unfollow/:followingUserId')
    @UseGuards(JwtAuthenticationGuard)
    unfollowUser(
        @Req() request: RequestWithUser,
        @Param('followingUserId') followingUserId: string,
    ): Promise<void> {
        return this.service.unfollowUser(request.user.id, followingUserId);
    }
  
    @Get('/followers')
    @UseGuards(JwtAuthenticationGuard)
    getFollowers(@Req() request: RequestWithUser,): Promise<User[]> {
        return this.service.getFollowers(request.user.id);
    }
  
    @Get('/following')
    @UseGuards(JwtAuthenticationGuard)
    getFollowing(@Req() request: RequestWithUser,): Promise<User[]> {
        return this.service.getFollowing(request.user.id);
    }
}
