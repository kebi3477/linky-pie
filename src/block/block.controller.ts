import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockResponseDto, CreateBlockDTO, UpdateBlockDTO } from './block.dto';
import { Block } from './block.entity';
import { BlockMessage } from './block.message';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { UserMessage } from '../user/user.message';

@Controller('blocks')
export class BlockController {
    constructor(private readonly service: BlockService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Body() createBlockDTO: CreateBlockDTO) {
        try {
            const newBlock: Block = await this.service.create(request.user.id, null, createBlockDTO);
            const result: BlockResponseDto<Block> = new BlockResponseDto();

            return result.set(HttpStatus.CREATED, BlockMessage.SUCCESS_CREATE, newBlock);
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

    @Get('/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async read(@Req() request: RequestWithUser, @Param('block_id') blockId: string) {
        try {
            const newBlock: Block = await this.service.read(request.user.id, blockId);
            const result: BlockResponseDto<Block> = new BlockResponseDto();

            return result.set(HttpStatus.OK, BlockMessage.SUCCESS_READ, newBlock);
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
    async update(@Req() request: RequestWithUser, @Param('block_id') blockId: string, @Body() updateBlockDTO: UpdateBlockDTO) {
        try {
            const newBlock: Block = await this.service.update(request.user.id, blockId, updateBlockDTO);
            const result: BlockResponseDto<Block> = new BlockResponseDto();

            return result.set(HttpStatus.OK, BlockMessage.SUCCESS_UPDATE, newBlock);
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
    async delete(@Req() request: RequestWithUser, @Param('block_id') blockId: string) {
        try {
            const newBlock: Block = await this.service.delete(request.user.id, blockId);
            const result: BlockResponseDto<Block> = new BlockResponseDto();

            return result.set(HttpStatus.OK, BlockMessage.SUCCESS_DELETE, newBlock);
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
    async getBlockList(@Req() request: RequestWithUser) {
        try {
            const blockList: Block[] = await this.service.getBlockListByUser(request.user.id);
            const result: BlockResponseDto<Block[]> = new BlockResponseDto();

            return result.set(HttpStatus.OK, BlockMessage.SUCCESS_READ, blockList);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
