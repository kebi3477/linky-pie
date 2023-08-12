import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockComment } from './blockComment.entity';
import { BlockCommentController } from './blockComment.controller';
import { BlockCommentService } from './blockComment.service';
import { BlockCommentRepository } from './blockComment.repository';
import { UserRepository } from '../user/user.repository';
import { BlockRepository } from '../block/block.repository';
import { User } from '../user/user.entity';
import { Block } from '../block/block.entity';
import { APP_PIPE } from '@nestjs/core';

@Module({
    imports: [
        TypeOrmModule.forFeature([ BlockComment, User, Block ]),
    ],
    controllers: [ BlockCommentController ],
    providers: [ 
        BlockCommentService, 
        BlockCommentRepository,
        UserRepository,
        BlockRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ],
})
export class BlockCommentModule {}
