import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockComment } from './block-comment.entity';
import { BlockCommentController } from './block-comment.controller';
import { BlockCommentService } from './block-comment.service';
import { BlockCommentRepository } from './block-comment.repository';
import { UserRepository } from '../user/user.repository';
import { BlockRepository } from '../block/block.repository';
import { User } from '../user/user.entity';
import { Block } from '../block/block.entity';
import { APP_PIPE } from '@nestjs/core';
import { UserLikesBlock } from '../userLikesBlock/userLikesBlock.entity';
import { UserLikesBlockRepository } from '../userLikesBlock/userLikesBlock.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([ BlockComment, User, Block, UserLikesBlock ]),
    ],
    controllers: [ BlockCommentController ],
    providers: [ 
        BlockCommentService, 
        BlockCommentRepository,
        UserRepository,
        BlockRepository,
        UserLikesBlockRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ],
})
export class BlockCommentModule {}
