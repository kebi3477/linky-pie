import { Module, ValidationPipe } from '@nestjs/common';
import { GroupService } from './block-group.service';
import { BlockGroupController } from './block-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from '../block/block.entity';
import { BlockGroup } from './block-group.entity';
import { APP_PIPE } from '@nestjs/core';
import { GroupRepository } from './block-group.repository';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Block, User, BlockGroup]),
    ],
    controllers: [ BlockGroupController ],
    providers: [ 
        GroupService,
        GroupRepository,
        UserRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ],
})
export class GroupModule {}
