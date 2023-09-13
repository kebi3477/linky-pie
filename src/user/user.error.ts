import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundError extends HttpException {
    constructor(message?: string) {
        super(message || '해당 사용자가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
}

export class UserConflictError extends HttpException { 
    constructor(message?: string) {
        super(message || '해당 아이디는 이미 사용 중입니다.', HttpStatus.CONFLICT);
    }
}