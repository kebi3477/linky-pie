import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { BlockSeriesService } from './block-series.service';
import { JwtAuthenticationGuard } from 'src/auth/jwt.strategy';
import { RequestWithUser } from 'src/auth/auth.interface';
import { CreateBlockSeriesDTO, UpdateBlockSeriesDTO } from './block-series.dto';
import { BlockSeries } from './block-series.entity';
import { UserMessage } from 'src/user/user.message';
import { BlockSeriesMessage } from './block-series.message';

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
}
