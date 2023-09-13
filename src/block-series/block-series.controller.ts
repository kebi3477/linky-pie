import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { BlockSeriesService } from './block-series.service';
import { JwtAuthenticationGuard } from 'src/auth/jwt.strategy';
import { RequestWithUser } from 'src/auth/auth.interface';
import { CreateBlockSeriesDTO, UpdateBlockSeriesDTO } from './block-series.dto';
import { BlockSeries } from './block-series.entity';
import { BlockSeriesBlock } from 'src/block-series-block/block-series-block.entity';
import { CreateBlockSeriesBlockDTO, UpdateBlockSeriesBlockDTO } from 'src/block-series-block/block-series-block.dto';
import { Block } from 'src/block/block.entity';

@Controller('series')
export class BlockSeriesController {
    constructor(private readonly service: BlockSeriesService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(
        @Req() request: RequestWithUser, 
        @Body() createBlockSeriesDTO: CreateBlockSeriesDTO
    ): Promise<BlockSeries> {
        return await this.service.create(request.user.id, createBlockSeriesDTO);
    }

    @Get("/:series_id")
    @UseGuards(JwtAuthenticationGuard)
    async read(
        @Req() request: RequestWithUser, 
        @Param("series_id") seriesId: string
    ): Promise<BlockSeries> {
        return await this.service.read(request.user.id, seriesId);
    }

    @Put("/:series_id")
    @UseGuards(JwtAuthenticationGuard)
    async update(
        @Req() request: RequestWithUser,
        @Param("series_id") seriesId: string, 
        @Body() updateBlockSeriesDTO: UpdateBlockSeriesDTO
    ): Promise<BlockSeries> {
        return await this.service.update(request.user.id, seriesId, updateBlockSeriesDTO);
    }

    @Delete("/:series_id")
    @UseGuards(JwtAuthenticationGuard)
    async delete(
        @Req() request: RequestWithUser, 
        @Param("series_id") seriesId: string
    ): Promise<BlockSeries> {
        return await this.service.delete(request.user.id, seriesId);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getList(
        @Req() request: RequestWithUser
    ): Promise<BlockSeries[]> {
        return await this.service.getList(request.user.id);
    }

    @Post('/:series_id/blocks/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async createSeriesBlock(
        @Req() request: RequestWithUser, 
        @Param('series_id') seriesId: string, 
        @Param('block_id') blockId: string,
        @Body() createBlockSeriesBlockDTO: CreateBlockSeriesBlockDTO
    ): Promise<BlockSeriesBlock> {
        return await this.service.createSeriesBlock(request.user.id, seriesId, blockId, createBlockSeriesBlockDTO);
    }

    @Put('/:series_id/blocks/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async updateSeriesBlock(
        @Req() request: RequestWithUser, 
        @Param('series_id') seriesId: string, 
        @Param('block_id') blockId: string,
        @Body() updateBlockSeriesBlockDTO: UpdateBlockSeriesBlockDTO
    ): Promise<BlockSeriesBlock> {
        return await this.service.updateSeriesBlock(request.user.id, seriesId, blockId, updateBlockSeriesBlockDTO);
    }
    
    @Delete('/:series_id/blocks/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async deleteSeriesBlock(
        @Req() request: RequestWithUser,
        @Param('series_id') seriesId: string, 
        @Param('block_id') blockId: string
    ): Promise<BlockSeriesBlock> {
        return await this.service.deleteSeriesBlock(request.user.id, seriesId, blockId);
    }

    @Get('/:series_id/blocks')
    @UseGuards(JwtAuthenticationGuard)
    async getSeriesBlockList(
        @Req() request: RequestWithUser,
        @Param('series_id') seriesId: string
    ): Promise<Block[]> {
        return await this.service.getListSeriesBlocks(request.user.id, seriesId);
    }
}
