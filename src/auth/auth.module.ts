import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KakaoStrategy } from './kakao.strategy';
import { GoogleStrategy } from './google.strategy';
import { NaverStrategy } from './naver.strategy';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [ 
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
                },
            }),
        }),
    ],
    controllers: [ 
        AuthController 
    ],
    providers: [
        AuthService,
        UserRepository,
        JwtStrategy,
        KakaoStrategy,
        GoogleStrategy,
        NaverStrategy,
    ]
})

export class AuthModule {}
