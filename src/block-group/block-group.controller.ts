import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateBlockGroupDTO, UpdateBlockGroupDTO } from './block-group.dto';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { BlockGroup } from './block-group.entity';
import { GroupService } from './block-group.service';
import { GroupMessage } from './block-group.message';
import { UserMessage } from '../user/user.message';

@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor)
export class BlockGroupController {
    constructor(private readonly service: GroupService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Body() createBlockGroupDTO: CreateBlockGroupDTO): Promise<BlockGroup> {
        try {
            return await this.service.create(request.user.id, createBlockGroupDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(GroupMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get("/:group_id")
    @UseGuards(JwtAuthenticationGuard)
    async read(@Req() request: RequestWithUser, @Param("group_id") groupId: string): Promise<BlockGroup> {
        try {
            return await this.service.read(request.user.id, groupId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === GroupMessage.NOT_FOUND) {
                throw new HttpException(GroupMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(GroupMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Put("/:group_id")
    @UseGuards(JwtAuthenticationGuard)
    async update(@Req() request: RequestWithUser, @Param("group_id") groupId: string, @Body() UpdateBlockGroupDTO: UpdateBlockGroupDTO): Promise<BlockGroup> {
        try {
            return await this.service.update(request.user.id, groupId, UpdateBlockGroupDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === GroupMessage.NOT_FOUND) {
                throw new HttpException(GroupMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(GroupMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Delete("/:group_id")
    @UseGuards(JwtAuthenticationGuard)
    async delete(@Req() request: RequestWithUser, @Param("group_id") groupId: string): Promise<BlockGroup> {
        try {
            return await this.service.delete(request.user.id, groupId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === GroupMessage.NOT_FOUND) {
                throw new HttpException(GroupMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(GroupMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getList(@Req() request: RequestWithUser): Promise<BlockGroup[]> {
        try {
            return await this.service.getList(request.user.id);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(GroupMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
