import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { BlockCommentService } from './block-comment.service';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { CreateBlockCommentDTO, UpdateBlockCommentDTO } from './block-comment.dto';
import { BlockCommentMessage } from './block-comment.message';
import { UserMessage } from '../user/user.message';
import { BlockMessage } from '../block/block.message';
import { BlockComment } from './block-comment.entity';

@Controller('blocks/:block_id/comments')
@UseInterceptors(ClassSerializerInterceptor)
export class BlockCommentController {
    constructor(private readonly service: BlockCommentService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    public async create(
        @Req() request: RequestWithUser, 
        @Param('block_id') blockId: string, 
        @Body() createBlockCommentDTO: CreateBlockCommentDTO
    ): Promise<BlockComment> {
        try {            
            return await this.service.create(request.user.id, blockId, createBlockCommentDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockCommentMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Put('/:comment_id')
    @UseGuards(JwtAuthenticationGuard)
    public async update(
        @Req() request: RequestWithUser, 
        @Param('block_id') blockId: string, 
        @Param('comment_id') commentId: number, 
        @Body() updateBlockCommentDTO: UpdateBlockCommentDTO
    ): Promise<BlockComment> {
        try {            
            return await this.service.update(request.user.id, blockId, commentId, updateBlockCommentDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockCommentMessage.NOT_FOUND) {
                throw new HttpException(BlockCommentMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockCommentMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Delete('/:comment_id')
    @UseGuards(JwtAuthenticationGuard)
    public async delete(
        @Req() request: RequestWithUser, 
        @Param('block_id') blockId: string, 
        @Param('comment_id') commentId: number
    ): Promise<BlockComment> {
        try {            
            return await this.service.delete(request.user.id, blockId, commentId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockCommentMessage.NOT_FOUND) {
                throw new HttpException(BlockCommentMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockCommentMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    public async getList(
        @Req() request: RequestWithUser, 
        @Param('block_id') blockId: string
    ): Promise<BlockComment[]> {
        try {            
            return await this.service.getList(request.user.id, blockId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockCommentMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
