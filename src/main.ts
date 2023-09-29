import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const pkiValidationPath = path.join(__dirname, '../../.well-known/pki-validation');
    app.use('/.well-known/pki-validation', express.static(pkiValidationPath));
    console.log(pkiValidationPath)

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
