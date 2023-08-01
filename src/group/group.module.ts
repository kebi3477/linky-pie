import { Module, ValidationPipe } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from 'src/entity/block.entity';
import { Group } from 'src/entity/group.entity';
import { APP_PIPE } from '@nestjs/core';
import { GroupRepository } from './group.repository';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Block, User, Group]),
    ],
    controllers: [ GroupController ],
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
