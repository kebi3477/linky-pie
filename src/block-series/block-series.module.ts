import { Module, ValidationPipe } from '@nestjs/common';
import { BlockSeriesController } from './block-series.controller';
import { BlockSeriesService } from './block-series.service';
import { BlockSeriesRepository } from './block-series.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockSeries } from './block-series.entity';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { APP_PIPE } from '@nestjs/core';
import { BlockSeriesBlock } from 'src/block-series-block/block-series-block.entity';
import { BlockSeriesBlockRepository } from 'src/block-series-block/block-series-block.repository';
import { BlockRepository } from 'src/block/block.repository';
import { Block } from 'src/block/block.entity';
import { UserLikesBlockRepository } from '../userLikesBlock/userLikesBlock.repository';
import { UserLikesBlock } from '../userLikesBlock/userLikesBlock.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Block, BlockSeries, User, BlockSeriesBlock, UserLikesBlock]),
    ],
    controllers: [
        BlockSeriesController
    ],
    providers: [
        BlockSeriesService,
        BlockRepository,
        BlockSeriesRepository,
        BlockSeriesBlockRepository,
        UserRepository,
        UserLikesBlockRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ]
})

export class BlockSeriesModule {}
