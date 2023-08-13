import { Test, TestingModule } from '@nestjs/testing';
import { BlockCommentService } from './block-comment.service';

describe('BlockCommentService', () => {
    let service: BlockCommentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [ BlockCommentService ],
        }).compile();

        service = module.get<BlockCommentService>(BlockCommentService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
