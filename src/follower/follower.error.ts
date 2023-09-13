import { HttpException, HttpStatus } from "@nestjs/common";

export class FollowerNotFoundError extends HttpException {
    constructor(message?: string) {
        super(message || '팔로우 상태가 아닙니다.', HttpStatus.NOT_FOUND);
    }
}

export class FollowerConflictError extends HttpException {
    constructor(message?: string) {
        super(message || '이미 팔로우 중입니다.', HttpStatus.CONFLICT);
    }
}