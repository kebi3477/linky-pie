import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockResponseDto, CreateBlockDTO } from './block.dto';
import { Block } from 'src/entity/block.entity';
import { BlockMessage } from './block.message';
import { JwtAuthenticationGuard } from 'src/auth/jwt.strategy';
import { RequestWithUser } from 'src/user/user.dto';

@Controller('blocks')
export class BlockController {
    constructor(private readonly service: BlockService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Body() createBlockDTO: CreateBlockDTO) {
        try {
            createBlockDTO.user_id = request.user.id;
            const newBlock: Block = await this.service.create(createBlockDTO);
            const result: BlockResponseDto = new BlockResponseDto();

            return result.set(HttpStatus.CREATED, BlockMessage.SUCCESS_CREATE, newBlock);
        } catch (error) {
            if (error.message === BlockMessage.CONFLICT) {
                throw new HttpException(BlockMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getBlockList(@Req() request: RequestWithUser) {
        try {
            const blockList: Block[] = await this.service.getBlockList(request.user.id);
            const result: BlockResponseDto = new BlockResponseDto();

            return result.set(HttpStatus.OK, BlockMessage.SUCCESS_READ, blockList);
        } catch (error) {
            if (error.message === BlockMessage.CONFLICT) {
                throw new HttpException(BlockMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(BlockMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get('/test')
    async getTest() {
        return await this.service.callChatGPT('test');
    }
}