import { Controller, Post, Get, Put, Patch, Delete, Body, HttpException, HttpStatus, Query, Param, UseGuards, HttpCode, Req, Res, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { BlockService } from './block.service';
import { CreateBlockDTO, UpdateBlockDTO } from './block.dto';
import { Block } from './block.entity';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { RequestWithUser } from '../auth/auth.interface';
import { UserLikesBlock } from '../userLikesBlock/userLikesBlock.entity';

@Controller('blocks')
@UseInterceptors(ClassSerializerInterceptor)
export class BlockController {
    constructor(private readonly service: BlockService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Body() createBlockDTO: CreateBlockDTO): Promise<Block> {
        return await this.service.create(request.user.id, null, createBlockDTO);
    }

    @Get('/:block_id([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})')
    @UseGuards(JwtAuthenticationGuard)
    async read(@Req() request: RequestWithUser, @Param('block_id') blockId: string): Promise<Block> {
        return await this.service.read(request.user.id, blockId);
    }

    @Put('/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async update(@Req() request: RequestWithUser, @Param('block_id') blockId: string, @Body() updateBlockDTO: UpdateBlockDTO): Promise<Block> {
        return await this.service.update(request.user.id, blockId, updateBlockDTO);
    }

    @Delete('/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async delete(@Req() request: RequestWithUser, @Param('block_id') blockId: string): Promise<Block> {
        return await this.service.delete(request.user.id, blockId);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getBlockList(@Req() request: RequestWithUser): Promise<Block[]> {
        return await this.service.getBlockListByUser(request.user.id);
    }

    @Post('/:block_id/likes')
    @UseGuards(JwtAuthenticationGuard)
    async createLikes(@Req() request: RequestWithUser, @Param('block_id') blockId: string): Promise<UserLikesBlock> {
        return await this.service.createLikes(request.user.id, blockId);
    }

    @Delete('/:block_id/likes')
    @UseGuards(JwtAuthenticationGuard)
    async deleteLikes(@Req() request: RequestWithUser, @Param('block_id') blockId: string): Promise<UserLikesBlock> {
        return await this.service.deleteLikes(request.user.id, blockId);
    }

    @Get('/likes')
    @UseGuards(JwtAuthenticationGuard)
    async getLikesBlockList(@Req() request: RequestWithUser): Promise<Block[]> {
        return await this.service.getLikesBlockList(request.user.id);
    }
}
