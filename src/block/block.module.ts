import { Module, ValidationPipe } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { BlockRepository } from './block.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from '../block/block.entity';
import { APP_PIPE } from '@nestjs/core';
import { Group } from '../group/group.entity';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { GroupRepository } from '../group/group.repository';
import { UserLikesBlockRepository } from '../userLikesBlock/userLikesBlock.repository';
import { UserLikesBlock } from '../userLikesBlock/userLikesBlock.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Block, User, Group, UserLikesBlock]),
    ],
    controllers: [ BlockController ],
    providers: [
        BlockService, 
        BlockRepository,
        UserRepository,
        GroupRepository,
        UserLikesBlockRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ],
})
export class BlockModule {}
