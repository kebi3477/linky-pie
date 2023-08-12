import { Module } from '@nestjs/common';
import { RetrospectiveController } from './retrospective.controller';
import { RetrospectiveService } from './retrospective.service';
import { RetrospectiveRepository } from './retrospective.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from '../block/block.entity';
import { User } from '../user/user.entity';
import { Retrospective } from './retrospective.entity';
import { UserRepository } from '../user/user.repository';
import { BlockRepository } from '../block/block.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Retrospective, Block, User]),
    ],
    controllers: [
        RetrospectiveController
    ],
    providers: [
        RetrospectiveService,
        RetrospectiveRepository,
        UserRepository,
        BlockRepository,
    ]
})
export class RetrospectiveModule {}
