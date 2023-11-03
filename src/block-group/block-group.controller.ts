import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateBlockGroupDTO, UpdateBlockGroupDTO } from './block-group.dto';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { BlockGroup } from './block-group.entity';
import { GroupService } from './block-group.service';

@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor)
export class BlockGroupController {
    constructor(private readonly service: GroupService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(
        @Req() request: RequestWithUser, 
        @Body() createBlockGroupDTO: CreateBlockGroupDTO
    ): Promise<BlockGroup> {
        return await this.service.create(request.user.id, createBlockGroupDTO);
    }

    @Get("/:group_id")
    @UseGuards(JwtAuthenticationGuard)
    async read(
        @Req() request: RequestWithUser, 
        @Param("group_id") groupId: string
    ): Promise<BlockGroup> {
        return await this.service.read(request.user.id, groupId);
    }

    @Put("/:group_id")
    @UseGuards(JwtAuthenticationGuard)
    async update(
        @Req() request: RequestWithUser, 
        @Param("group_id") groupId: string, 
        @Body() UpdateBlockGroupDTO: UpdateBlockGroupDTO
    ): Promise<BlockGroup> {
        return await this.service.update(request.user.id, groupId, UpdateBlockGroupDTO);
    }

    @Delete("/:group_id")
    @UseGuards(JwtAuthenticationGuard)
    async delete(
        @Req() request: RequestWithUser, 
        @Param("group_id") groupId: string
    ): Promise<BlockGroup> {
        return await this.service.delete(request.user.id, groupId);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getList(
        @Req() request: RequestWithUser
    ): Promise<BlockGroup[]> {
        return await this.service.getList(request.user.id);
    }

    @Get('/users/:user_id')
    @UseGuards(JwtAuthenticationGuard)
    async getListByUserId(
        @Req() request: RequestWithUser,
        @Param("user_id") userId: string
    ): Promise<BlockGroup[]> {
        return await this.service.getList(userId);
    }
}
