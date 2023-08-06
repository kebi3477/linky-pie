import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/user/user.repository';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        LocalStrategy,
        JwtStrategy,
    ]
})

export class AuthModule {}
