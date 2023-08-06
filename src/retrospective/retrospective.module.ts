import { Module } from '@nestjs/common';
import { RetrospectiveController } from './retrospective.controller';
import { RetrospectiveService } from './retrospective.service';
import { RetrospectiveRepository } from './retrospective.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from 'src/block/block.entity';
import { User } from 'src/user/user.entity';
import { Retrospective } from './retrospective.entity';
import { UserRepository } from 'src/user/user.repository';
import { BlockRepository } from 'src/block/block.repository';

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
