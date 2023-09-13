import { HttpException, HttpStatus } from "@nestjs/common";

export class BlockSeriesBlockNotFoundError extends HttpException {
    constructor(message?: string) {
        super(message || '해당 아이디의 시리즈의 블록이 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
}

export class BlockSeriesBlockConflictError extends HttpException {
    constructor(message?: string) {
        super(message || '이미 시리즈에 블록이 존재합니다.', HttpStatus.CONFLICT);
    }
}