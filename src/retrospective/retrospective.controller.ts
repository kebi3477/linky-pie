import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { RetrospectiveService } from './retrospective.service';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { CreateRetrospectiveDTO, UpdateRetrospectiveDTO } from './retrospective.dto';
import { Retrospective } from './retrospective.entity';
import { RetrospectiveMessage } from './retrospective.message';
import { UserMessage } from '../user/user.message';
import { BlockMessage } from '../block/block.message';

@Controller('blocks/:block_id/retrospectives')
@UseInterceptors(ClassSerializerInterceptor)
export class RetrospectiveController {
    constructor(private readonly service: RetrospectiveService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Param('block_id') blockId: string, @Body() createRetrospectiveDTO: CreateRetrospectiveDTO): Promise<Retrospective> {
        try {
            return await this.service.create(request.user.id, blockId, createRetrospectiveDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(RetrospectiveMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get('/:retrospective_id')
    @UseGuards(JwtAuthenticationGuard)
    async read(@Req() request: RequestWithUser, @Param('block_id') blockId: string, @Param('retrospective_id') retrospectiveId: number): Promise<Retrospective> {
        try {
            return await this.service.read(request.user.id, blockId, retrospectiveId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === RetrospectiveMessage.NOT_FOUND) {
                throw new HttpException(RetrospectiveMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(RetrospectiveMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Put('/:retrospective_id')
    @UseGuards(JwtAuthenticationGuard)
    async update(
        @Req() request: RequestWithUser, 
        @Param('block_id') blockId: string,
        @Param('retrospective_id') retrospectiveId: number, 
        @Body() updateRetrospectiveDTO: UpdateRetrospectiveDTO,
    ): Promise<Retrospective> {
        try {
            return await this.service.update(request.user.id, blockId, retrospectiveId, updateRetrospectiveDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === RetrospectiveMessage.NOT_FOUND) {
                throw new HttpException(RetrospectiveMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(RetrospectiveMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Delete('/:retrospective_id')
    @UseGuards(JwtAuthenticationGuard)
    async delete(@Req() request: RequestWithUser, @Param('block_id') blockId: string, @Param('retrospective_id') retrospectiveId: number): Promise<Retrospective> {
        try {
            return await this.service.delete(request.user.id, blockId, retrospectiveId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === RetrospectiveMessage.NOT_FOUND) {
                throw new HttpException(RetrospectiveMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(RetrospectiveMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
