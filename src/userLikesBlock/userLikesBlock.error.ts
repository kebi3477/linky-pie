import { HttpException, HttpStatus } from "@nestjs/common";

export class UserLikesBlockNotFoundError extends HttpException {
    constructor(message?: string) {
        super(message || '좋아요를 하지 않았습니다.', HttpStatus.NOT_FOUND)
    }
}

export class UserLikesBlockConflictError extends HttpException {
    constructor(message?: string) {
        super(message || '이미 좋아요를 했습니다.', HttpStatus.CONFLICT)
    }
} 