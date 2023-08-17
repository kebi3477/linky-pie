import { Module, ValidationPipe } from '@nestjs/common';
import { BlockSeriesController } from './block-series.controller';
import { BlockSeriesService } from './block-series.service';
import { BlockSeriesRepository } from './block-series.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockSeries } from './block-series.entity';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { APP_PIPE } from '@nestjs/core';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlockSeries, User]),
    ],
    controllers: [
        BlockSeriesController
    ],
    providers: [
        BlockSeriesService,
        BlockSeriesRepository,
        UserRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ]
})

export class BlockSeriesModule {}
