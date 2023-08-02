import { Module, ValidationPipe } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { FollowerRepository } from 'src/follower/follower.repository';
import { Follower } from 'src/entity/follower.entity';

@Module({
    imports: [ 
        TypeOrmModule.forFeature([User, Follower]),
    ],
    controllers: [ UserController ],
    providers: [
        UserService,
        UserRepository,
        FollowerRepository,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
    ],
})
export class UserModule {}
