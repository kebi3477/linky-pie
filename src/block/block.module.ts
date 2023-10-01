import { Module, ValidationPipe } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { BlockRepository } from './block.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from '../block/block.entity';
import { APP_PIPE } from '@nestjs/core';
import { BlockGroup } from '../block-group/block-group.entity';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { GroupRepository } from '../block-group/block-group.repository';
import { UserLikesBlockRepository } from '../userLikesBlock/userLikesBlock.repository';
import { UserLikesBlock } from '../userLikesBlock/userLikesBlock.entity';
import { BlockCommentRepository } from 'src/block-comment/block-comment.repository';
import { BlockComment } from 'src/block-comment/block-comment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Block, User, BlockGroup, UserLikesBlock, BlockComment]),
    ],
    controllers: [ BlockController ],
    providers: [
        BlockService, 
        BlockRepository,
        UserRepository,
        GroupRepository,
        UserLikesBlockRepository,
        BlockCommentRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ],
})
export class BlockModule {}
