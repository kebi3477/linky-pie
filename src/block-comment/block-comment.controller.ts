import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { BlockCommentService } from './block-comment.service';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { CreateBlockCommentDTO, UpdateBlockCommentDTO } from './block-comment.dto';
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
        return await this.service.create(request.user.id, blockId, createBlockCommentDTO);
    }

    @Put('/:comment_id')
    @UseGuards(JwtAuthenticationGuard)
    public async update(
        @Req() request: RequestWithUser, 
        @Param('block_id') blockId: string, 
        @Param('comment_id') commentId: number, 
        @Body() updateBlockCommentDTO: UpdateBlockCommentDTO
    ): Promise<BlockComment> {
        return await this.service.update(request.user.id, blockId, commentId, updateBlockCommentDTO);
    }

    @Delete('/:comment_id')
    @UseGuards(JwtAuthenticationGuard)
    public async delete(
        @Req() request: RequestWithUser, 
        @Param('block_id') blockId: string, 
        @Param('comment_id') commentId: number
    ): Promise<BlockComment> {
        return await this.service.delete(request.user.id, blockId, commentId);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    public async getList(
        @Req() request: RequestWithUser, 
        @Param('block_id') blockId: string
    ): Promise<BlockComment[]> {
        return await this.service.getList(request.user.id, blockId);
    }
}
