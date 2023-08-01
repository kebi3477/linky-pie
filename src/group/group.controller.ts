import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { GroupResponseDto, CreateGroupDTO } from './group.dto';
import { JwtAuthenticationGuard } from 'src/auth/jwt.strategy';
import { RequestWithUser } from 'src/auth/auth.interface';
import { Group } from 'src/entity/group.entity';
import { GroupService } from './group.service';
import { GroupMessage } from 'src/module/message';

@Controller('groups')
export class GroupController {
    constructor(private readonly service: GroupService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Body() createGroupDTO: CreateGroupDTO) {
        try {
            const newBlock: Group = await this.service.create(request.user.id, createGroupDTO);
            const result: GroupResponseDto = new GroupResponseDto();

            return result.set(HttpStatus.CREATED, GroupMessage.SUCCESS_CREATE, newBlock);
        } catch (error) {
            if (error.message === GroupMessage.CONFLICT) {
                throw new HttpException(GroupMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(GroupMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getBlockList(@Req() request: RequestWithUser) {
        try {
            const blockList: Group[] = await this.service.getGroupList(request.user.id);
            const result: GroupResponseDto = new GroupResponseDto();

            return result.set(HttpStatus.OK, GroupMessage.SUCCESS_READ, blockList);
        } catch (error) {
            if (error.message === GroupMessage.CONFLICT) {
                throw new HttpException(GroupMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(GroupMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
