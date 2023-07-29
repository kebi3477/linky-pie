import { Module, ValidationPipe } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { BlockRepository } from './block.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from 'src/entity/block.entity';
import { APP_PIPE } from '@nestjs/core';
import { User } from 'src/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Block, User]),
    ],
    controllers: [ BlockController ],
    providers: [
        BlockService, 
        BlockRepository,
        UserRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ],
})
export class BlockModule {}
