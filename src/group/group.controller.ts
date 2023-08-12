import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GroupResponseDto, CreateGroupDTO, UpdateGroupDTO } from './group.dto';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { Group } from '../group/group.entity';
import { GroupService } from './group.service';
import { GroupMessage } from '../module/message';
import { UserMessage } from '../user/user.message';

@Controller('groups')
export class GroupController {
    constructor(private readonly service: GroupService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Body() createGroupDTO: CreateGroupDTO) {
        try {
            const group: Group = await this.service.create(request.user.id, createGroupDTO);
            const result: GroupResponseDto<Group> = new GroupResponseDto();

            return result.set(HttpStatus.CREATED, GroupMessage.SUCCESS_CREATE, group);
        } catch (error) {
            if (error.message === GroupMessage.CONFLICT) {
                throw new HttpException(GroupMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(GroupMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get("/:group_id")
    @UseGuards(JwtAuthenticationGuard)
    async read(@Req() request: RequestWithUser, @Param("group_id") groupId: string) {
        try {
            const group: Group = await this.service.read(request.user.id, groupId);
            const result: GroupResponseDto<Group> = new GroupResponseDto();

            return result.set(HttpStatus.OK, GroupMessage.SUCCESS_READ, group);
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
    async update(@Req() request: RequestWithUser, @Param("group_id") groupId: string, @Body() updateGroupDTO: UpdateGroupDTO) {
        try {
            const group: Group = await this.service.update(request.user.id, groupId, updateGroupDTO);
            const result: GroupResponseDto<Group> = new GroupResponseDto();

            return result.set(HttpStatus.OK, GroupMessage.SUCCESS_UPDATE, group);
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
    async delete(@Req() request: RequestWithUser, @Param("group_id") groupId: string) {
        try {
            const group: Group = await this.service.delete(request.user.id, groupId);
            const result: GroupResponseDto<Group> = new GroupResponseDto();

            return result.set(HttpStatus.OK, GroupMessage.SUCCESS_DELETE, group);
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
    async getGroupList(@Req() request: RequestWithUser) {
        try {
            const groupList: Group[] = await this.service.getGroupList(request.user.id);
            const result: GroupResponseDto<Group[]> = new GroupResponseDto();

            return result.set(HttpStatus.OK, GroupMessage.SUCCESS_READ, groupList);
        } catch (error) {
            if (error.message === GroupMessage.CONFLICT) {
                throw new HttpException(GroupMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(GroupMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
