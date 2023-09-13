import { HttpException, HttpStatus } from "@nestjs/common";

export class BlockSeriesNotFoundError extends HttpException {
    constructor(message?: string) {
        super(message || '시리즈가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
}