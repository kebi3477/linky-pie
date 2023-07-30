import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BlockModule } from './block/block.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: configService.get('DATABASE_PORT'),
                username: configService.get('DATABASE_USER'),
                password: configService.get('DATABASE_PASS'),
                database: configService.get('DATABASE_NAME'),
                entities: [__dirname + '/entity/*.entity.{js,ts}'],
                synchronize : true,
                logging: true,
                timezone: 'local',
            }),
        }),
        UserModule,
        BlockModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
