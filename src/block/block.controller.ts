import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { BlockService } from './block.service';
import { CreateBlockDTO, UpdateBlockDTO } from './block.dto';
import { Block } from './block.entity';
import { BlockMessage } from './block.message';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { UserMessage } from '../user/user.message';
import { UserLikesBlock } from '../userLikesBlock/userLikesBlock.entity';
import { UserLikesBLockMessage } from '../userLikesBlock/userLikesBlock.message';

@Controller('blocks')
@UseInterceptors(ClassSerializerInterceptor)
export class BlockController {
    constructor(private readonly service: BlockService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Body() createBlockDTO: CreateBlockDTO): Promise<Block> {
        try {
            return await this.service.create(request.user.id, null, createBlockDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND_CONTENT) {
                throw new HttpException(BlockMessage.NOT_FOUND_CONTENT, HttpStatus.BAD_REQUEST);
            } else if (error.message === BlockMessage.GPT_ERROR) {
                throw new HttpException(BlockMessage.GPT_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get('/:block_id([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})')
    @UseGuards(JwtAuthenticationGuard)
    async read(@Req() request: RequestWithUser, @Param('block_id') blockId: string): Promise<Block> {
        try {
            return await this.service.read(request.user.id, blockId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Put('/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async update(@Req() request: RequestWithUser, @Param('block_id') blockId: string, @Body() updateBlockDTO: UpdateBlockDTO): Promise<Block> {
        try {
            return await this.service.update(request.user.id, blockId, updateBlockDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Delete('/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async delete(@Req() request: RequestWithUser, @Param('block_id') blockId: string): Promise<Block> {
        try {
            return await this.service.delete(request.user.id, blockId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getBlockList(@Req() request: RequestWithUser): Promise<Block[]> {
        try {
            return await this.service.getBlockListByUser(request.user.id);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post('/:block_id/likes')
    @UseGuards(JwtAuthenticationGuard)
    async createLikes(@Req() request: RequestWithUser, @Param('block_id') blockId: string): Promise<UserLikesBlock> {
        try {
            return await this.service.createLikes(request.user.id, blockId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === UserLikesBLockMessage.CONFLICT) {
                throw new HttpException(UserLikesBLockMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Delete('/:block_id/likes')
    @UseGuards(JwtAuthenticationGuard)
    async deleteLikes(@Req() request: RequestWithUser, @Param('block_id') blockId: string): Promise<UserLikesBlock> {
        try {
            return await this.service.deleteLikes(request.user.id, blockId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === UserLikesBLockMessage.NOT_FOUND) {
                throw new HttpException(UserLikesBLockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get('/likes')
    @UseGuards(JwtAuthenticationGuard)
    async getLikesBlockList(@Req() request: RequestWithUser): Promise<Block[]> {
        try {
            return await this.service.getLikesBlockList(request.user.id);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
