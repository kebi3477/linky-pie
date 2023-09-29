import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as fs from 'fs';

const { UPLOAD_DIR, PORT, IS_HTTPS, HTTPS_KEY_URL, HTTPS_CERT_URL } = process.env;

async function bootstrap() {
    const app = await getApp();

    app.setGlobalPrefix('api');
    app.use('/uploads', express.static(UPLOAD_DIR));
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    await app.listen(PORT);
}

async function getApp() {
    if (IS_HTTPS === 'true') {
        const httpsOptions = {
            key: fs.readFileSync(HTTPS_KEY_URL),
            cert: fs.readFileSync(HTTPS_CERT_URL),
        };
        
        return await NestFactory.create(AppModule, { httpsOptions });
    } else {
        return await NestFactory.create(AppModule);
    }
}
bootstrap();
