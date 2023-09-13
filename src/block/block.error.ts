import { HttpException, HttpStatus } from "@nestjs/common";

export class BlockNotFoundError extends HttpException {
    constructor(message?: string) {
        super(message || '블록이 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
}

export class BlockServerError extends HttpException {
    constructor(message?: string) {
        super(message || '서버에서 처리 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR)
    }
}