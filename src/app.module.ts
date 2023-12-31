import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BlockModule } from './block/block.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './block-group/block-group.module';
import { BlockCommentModule } from './block-comment/block-comment.module';
import { BlockSeriesModule } from './block-series/block-series.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'client'),
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
                entities: [__dirname + '/*/*.entity.{js,ts}'],
                synchronize : true,
                logging: true,
                timezone: 'Asia/Seoul',
            }),
        }),
        UserModule,
        BlockModule,
        AuthModule,
        GroupModule,
        BlockCommentModule,
        BlockSeriesModule,
    ],
    controllers: [],
    providers: [],
})

export class AppModule {}