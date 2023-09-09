import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.use('/uploads', express.static(process.env.UPLOAD_DIR));
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    await app.listen(process.env.PORT);
}
bootstrap();
