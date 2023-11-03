import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res, UseInterceptors, ClassSerializerInterceptor, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDescribeDTO, UpdateUserNameDTO } from './user.dto';
import { User } from '../user/user.entity';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        return await this.service.create(createUserDTO);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async readSearch(@Req() request: RequestWithUser, @Query('search') search?: string): Promise<User[]> {
        return await this.service.findAllUsers(request.user.id, search);
    }
    
    @Get('/me')
    @UseGuards(JwtAuthenticationGuard)
    async readMe(@Req() request: RequestWithUser): Promise<User> {
        return await this.service.getById(request.user.id);
    }
    
    @Get('/:user_id')
    @UseGuards(JwtAuthenticationGuard)
    async readUser(@Param('user_id') userId: string): Promise<User> {
        return await this.service.getById(userId);
    }
    
    @Patch('/name')
    @UseGuards(JwtAuthenticationGuard)
    async updateName(@Req() request: RequestWithUser, @Body() updateUserNameDTO: UpdateUserNameDTO): Promise<User> {
        return await this.service.updateName(request.user.id, updateUserNameDTO);
    }

    @Patch('/image')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('profileImage', multerConfig))
    async updateProfileImage(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File): Promise<any> {
        return await this.service.updateProfileImage(request.user.id, file);
    }

    @Patch('/describe')
    @UseGuards(JwtAuthenticationGuard)
    async updateDescribe(@Req() request: RequestWithUser, @Body() updateUserDescribeDTO: UpdateUserDescribeDTO): Promise<User> {
        return await this.service.updateDescribe(request.user.id, updateUserDescribeDTO);
    }

    @Post('/follow/:follow_id')
    @UseGuards(JwtAuthenticationGuard)
    async followUser(@Req() request: RequestWithUser, @Param('follow_id') followId: string): Promise<User> {
        return await this.service.followUser(request.user.id, followId);
    }
  
    @Delete('/follow/:follow_id')
    @UseGuards(JwtAuthenticationGuard)
    async unfollowUser(@Req() request: RequestWithUser, @Param('follow_id') followId: string): Promise<User> {
        return await this.service.unfollowUser(request.user.id, followId);
    }
  
    @Get('/followers')
    @UseGuards(JwtAuthenticationGuard)
    async getFollowers(@Req() request: RequestWithUser): Promise<User[]> {
        return await this.service.getFollowers(request.user.id);
    }
  
    @Get('/followings')
    @UseGuards(JwtAuthenticationGuard)
    async getFollowings(@Req() request: RequestWithUser): Promise<User[]> {
        return await this.service.getFollowings(request.user.id);
    }
}
