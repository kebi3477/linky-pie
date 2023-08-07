import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { RetrospectiveService } from './retrospective.service';
import { JwtAuthenticationGuard } from 'src/auth/jwt.strategy';
import { RequestWithUser } from 'src/auth/auth.interface';
import { CreateRetrospectiveDTO, RetrospectiveResponseDto, UpdateRetrospectiveDTO } from './retrospective.dto';
import { Retrospective } from './retrospective.entity';
import { RetrospectiveMessage } from './retrospective.message';
import { UserMessage } from 'src/user/user.message';
import { BlockMessage } from 'src/block/block.message';

@Controller('blocks/:block_id/retrospectives')
export class RetrospectiveController {
    constructor(private readonly service: RetrospectiveService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Param('block_id') blockId: string, @Body() createRetrospectiveDTO: CreateRetrospectiveDTO) {
        try {
            const newBlock: Retrospective = await this.service.create(request.user.id, blockId, createRetrospectiveDTO);
            const result: RetrospectiveResponseDto<Retrospective> = new RetrospectiveResponseDto();

            return result.set(HttpStatus.CREATED, RetrospectiveMessage.SUCCESS_CREATE, newBlock);
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
    async read(@Req() request: RequestWithUser, @Param('block_id') blockId: string, @Param('retrospective_id') retrospectiveId: number) {
        try {
            const retrospective: Retrospective = await this.service.read(request.user.id, blockId, retrospectiveId);
            const result: RetrospectiveResponseDto<Retrospective> = new RetrospectiveResponseDto();

            return result.set(HttpStatus.OK, RetrospectiveMessage.SUCCESS_READ, retrospective);
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
    ) {
        try {
            const retrospective: Retrospective = await this.service.update(request.user.id, blockId, retrospectiveId, updateRetrospectiveDTO);
            const result: RetrospectiveResponseDto<Retrospective> = new RetrospectiveResponseDto();

            return result.set(HttpStatus.OK, RetrospectiveMessage.SUCCESS_UPDATE, retrospective);
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
    async delete(@Req() request: RequestWithUser, @Param('block_id') blockId: string, @Param('retrospective_id') retrospectiveId: number) {
        try {
            const retrospective: Retrospective = await this.service.delete(request.user.id, blockId, retrospectiveId);
            const result: RetrospectiveResponseDto<Retrospective> = new RetrospectiveResponseDto();

            return result.set(HttpStatus.OK, RetrospectiveMessage.SUCCESS_DELETE, retrospective);
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
