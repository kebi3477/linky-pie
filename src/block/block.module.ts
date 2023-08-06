import { Module, ValidationPipe } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { BlockRepository } from './block.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from 'src/block/block.entity';
import { APP_PIPE } from '@nestjs/core';
import { Group } from 'src/group/group.entity';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/user/user.entity';
import { GroupRepository } from 'src/group/group.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Block, User, Group]),
    ],
    controllers: [ BlockController ],
    providers: [
        BlockService, 
        BlockRepository,
        UserRepository,
        GroupRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ],
})
export class BlockModule {}
