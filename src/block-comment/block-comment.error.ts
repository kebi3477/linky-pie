import { HttpException, HttpStatus } from "@nestjs/common";

export class BlockCommentNotFoundError extends HttpException {
    constructor(message?: string) {
        super(message || '댓글이 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
}