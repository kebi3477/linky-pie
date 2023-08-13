import { Test, TestingModule } from '@nestjs/testing';
import { BlockCommentController } from './block-comment.controller';
import { BlockCommentService } from './block-comment.service';
import { Block } from '../block/block.entity';
import { CreateBlockCommentDTO } from './block-comment.dto';

describe('BlockCommentController', () => {
    let controller: BlockCommentController;
    let service: BlockCommentService;

    const MOCK_USER_ID = 'kebi3477';
    const MOCK_BLOCK_ID = "block_id";
    const MOCK_COMMENT_ID = 1;
    const mockBlock = new Block();

    beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [BlockCommentController],
    }).compile();

        controller = module.get<BlockCommentController>(BlockCommentController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a comment and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };
            const mockDTO = new CreateBlockCommentDTO();

            const result = await controller.create(req as any, MOCK_BLOCK_ID, mockDTO);
    
            expect(result).toBeDefined();
            expect(service.create).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID, mockDTO);
        });  
    })

    describe('update', () => {
        it('should update a comment and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };
            const mockDTO = new CreateBlockCommentDTO();

            const result = await controller.update(req as any, MOCK_BLOCK_ID, MOCK_COMMENT_ID, mockDTO);
    
            expect(result).toBeDefined();
            expect(service.update).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID, MOCK_COMMENT_ID, mockDTO);
        });  
    })

    describe('delete', () => {
        it('should delete a comment and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };

            const result = await controller.delete(req as any, MOCK_BLOCK_ID, MOCK_COMMENT_ID);
    
            expect(result).toBeDefined();
            expect(service.delete).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID, MOCK_COMMENT_ID);
        });  
    })
});
