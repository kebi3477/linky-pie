import { HttpException, HttpStatus } from "@nestjs/common";

export class BlockGroupNotFoundError extends HttpException {
    constructor(message?: string) {
        super(message || '그룹이 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
}