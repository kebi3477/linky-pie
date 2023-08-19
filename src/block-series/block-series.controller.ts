import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { BlockSeriesService } from './block-series.service';
import { JwtAuthenticationGuard } from 'src/auth/jwt.strategy';
import { RequestWithUser } from 'src/auth/auth.interface';
import { CreateBlockSeriesDTO, UpdateBlockSeriesDTO } from './block-series.dto';
import { BlockSeries } from './block-series.entity';
import { UserMessage } from 'src/user/user.message';
import { BlockSeriesMessage } from './block-series.message';
import { BlockSeriesBlock } from 'src/block-series-block/block-series-block.entity';
import { CreateBlockSeriesBlockDTO, UpdateBlockSeriesBlockDTO } from 'src/block-series-block/block-series-block.dto';
import { BlockSeriesBlockMessage } from 'src/block-series-block/block-series-block.message';
import { Block } from 'src/block/block.entity';
import { BlockMessage } from 'src/block/block.message';

@Controller('series')
export class BlockSeriesController {
    constructor(private readonly service: BlockSeriesService) {}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() request: RequestWithUser, @Body() createBlockSeriesDTO: CreateBlockSeriesDTO): Promise<BlockSeries> {
        try {
            return await this.service.create(request.user.id, createBlockSeriesDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockSeriesMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get("/:series_id")
    @UseGuards(JwtAuthenticationGuard)
    async read(@Req() request: RequestWithUser, @Param("series_id") seriesId: string): Promise<BlockSeries> {
        try {
            return await this.service.read(request.user.id, seriesId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesMessage.NOT_FOUND) {
                throw new HttpException(BlockSeriesMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockSeriesMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Put("/:series_id")
    @UseGuards(JwtAuthenticationGuard)
    async update(@Req() request: RequestWithUser, @Param("series_id") seriesId: string, @Body() updateBlockSeriesDTO: UpdateBlockSeriesDTO): Promise<BlockSeries> {
        try {
            return await this.service.update(request.user.id, seriesId, updateBlockSeriesDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesMessage.NOT_FOUND) {
                throw new HttpException(BlockSeriesMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockSeriesMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Delete("/:series_id")
    @UseGuards(JwtAuthenticationGuard)
    async delete(@Req() request: RequestWithUser, @Param("series_id") seriesId: string): Promise<BlockSeries> {
        try {
            return await this.service.delete(request.user.id, seriesId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesMessage.NOT_FOUND) {
                throw new HttpException(BlockSeriesMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockSeriesMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getList(@Req() request: RequestWithUser): Promise<BlockSeries[]> {
        try {
            return await this.service.getList(request.user.id);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockSeriesMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post('/:series_id/blocks/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async createSeriesBlock(
        @Req() request: RequestWithUser, 
        @Param('series_id') seriesId: string, 
        @Param('block_id') blockId: string,
        @Body() createBlockSeriesBlockDTO: CreateBlockSeriesBlockDTO
    ): Promise<BlockSeriesBlock> {
        try {
            return await this.service.createSeriesBlock(request.user.id, seriesId, blockId, createBlockSeriesBlockDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesMessage.NOT_FOUND) {
                throw new HttpException(BlockSeriesMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockMessage.NOT_FOUND) {
                throw new HttpException(BlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesBlockMessage.CONFLICT) {
                throw new HttpException(BlockSeriesBlockMessage.CONFLICT, HttpStatus.CONFLICT);
            } else {
                throw new HttpException(BlockSeriesMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Put('/:series_id/blocks/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async updateSeriesBlock(
        @Req() request: RequestWithUser, 
        @Param('series_id') seriesId: string, 
        @Param('block_id') blockId: string,
        @Body() updateBlockSeriesBlockDTO: UpdateBlockSeriesBlockDTO
    ): Promise<BlockSeriesBlock> {
        try {
            return await this.service.updateSeriesBlock(request.user.id, seriesId, blockId, updateBlockSeriesBlockDTO);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesMessage.NOT_FOUND) {
                throw new HttpException(BlockSeriesMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesBlockMessage.NOT_FOUND) {
                throw new HttpException(BlockSeriesBlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockSeriesMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    
    @Delete('/:series_id/blocks/:block_id')
    @UseGuards(JwtAuthenticationGuard)
    async deleteSeriesBlock(
        @Req() request: RequestWithUser,
        @Param('series_id') seriesId: string, 
        @Param('block_id') blockId: string
    ): Promise<BlockSeriesBlock> {
        try {
            return await this.service.deleteSeriesBlock(request.user.id, seriesId, blockId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesMessage.NOT_FOUND) {
                throw new HttpException(BlockSeriesMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesBlockMessage.NOT_FOUND) {
                throw new HttpException(BlockSeriesBlockMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockSeriesMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get('/:series_id/blocks')
    @UseGuards(JwtAuthenticationGuard)
    async getSeriesBlockList(
        @Req() request: RequestWithUser,
        @Param('series_id') seriesId: string
    ): Promise<Block[]> {
        try {
            return await this.service.getListSeriesBlocks(request.user.id, seriesId);
        } catch (error) {
            if (error.message === UserMessage.NOT_FOUND) {
                throw new HttpException(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else if (error.message === BlockSeriesMessage.NOT_FOUND) {
                throw new HttpException(BlockSeriesMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(BlockSeriesMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
