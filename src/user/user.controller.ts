import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res, UseInterceptors, ClassSerializerInterceptor, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserNameDTO } from './user.dto';
import { User } from '../user/user.entity';
import { UserMessage } from './user.message';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { FollowerMessage } from '../follower/follower.message';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        try {
            return await this.service.create(createUserDTO);
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
    async readMe(@Req() request: RequestWithUser): Promise<User> {
        try {
            return await this.service.getById(request.user.id);
        } catch (error) {
            throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async readSearch(@Req() request: RequestWithUser, @Query('id') id?: string): Promise<User[]> {
        try {
            return await this.service.findAllUsers(request.user.id, id);
        } catch (error) {
            throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('/name')
    @UseGuards(JwtAuthenticationGuard)
    async updateName(@Req() request: RequestWithUser, @Body() updateUserNameDTO: UpdateUserNameDTO): Promise<User> {
        try {
            return await this.service.updateName(request.user.id, updateUserNameDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Patch('/image')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('profileImage', multerConfig))
    async updateProfileImage(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File): Promise<any> {
        try {
            return await this.service.updateProfileImage(request.user.id, file);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post('/follow/:follow_id')
    @UseGuards(JwtAuthenticationGuard)
    async followUser(@Req() request: RequestWithUser, @Param('follow_id') followId: string): Promise<User> {
        try {
            return await this.service.followUser(request.user.id, followId);
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
  
    @Delete('/follow/:follow_id')
    @UseGuards(JwtAuthenticationGuard)
    async unfollowUser(@Req() request: RequestWithUser, @Param('follow_id') followId: string): Promise<User> {
        try {
            return await this.service.unfollowUser(request.user.id, followId);
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
    async getFollowers(@Req() request: RequestWithUser): Promise<User[]> {
        try {
            return await this.service.getFollowers(request.user.id);
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
    async getFollowings(@Req() request: RequestWithUser): Promise<User[]> {
        try {
            return await this.service.getFollowings(request.user.id);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(UserMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
