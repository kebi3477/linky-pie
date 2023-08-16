import { Test, TestingModule } from '@nestjs/testing';
import { BlockCommentController } from './block-comment.controller';
import { BlockCommentService } from './block-comment.service';
import { Block } from '../block/block.entity';
import { CreateBlockCommentDTO } from './block-comment.dto';
import { BlockComment } from './block-comment.entity';

describe('BlockCommentController', () => {
    let controller: BlockCommentController;
    let service: BlockCommentService;

    const MOCK_USER_ID = 'kebi3477';
    const MOCK_BLOCK_ID = "block_id";
    const MOCK_COMMENT_ID = 1;
    const mockBlockComment = new BlockComment();

    beforeEach(async () => {
        const mockBlockCommentService = {
            create: jest.fn().mockImplementation((userId, blockId, createBlockCommentDTO) => Promise.resolve(new BlockComment())).mockReturnValue(new BlockComment()),
            update: jest.fn().mockResolvedValue(new BlockComment()).mockReturnValue(new BlockComment()),
            delete: jest.fn().mockResolvedValue(new BlockComment()).mockReturnValue(new BlockComment()),
            getList: jest.fn().mockResolvedValue(Array<BlockComment>).mockReturnValue(new BlockComment()),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [BlockCommentController],
            providers: [
                { provide: BlockCommentService, useValue: mockBlockCommentService },
            ],
        }).compile();

        controller = module.get<BlockCommentController>(BlockCommentController);
        service = module.get<BlockCommentService>(BlockCommentService);
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
            expect(result).toEqual(mockBlockComment);
        });  
    })

    describe('read', () => {
        it('should return block comment list', async () => {
            const req = { user: { id: MOCK_USER_ID } };

            const result = await controller.getList(req as any, MOCK_BLOCK_ID);
    
            expect(result).toBeDefined();
            expect(service.getList).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID);
            expect(result).toEqual(mockBlockComment);
        });
    })

    describe('update', () => {
        it('should update a comment and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };
            const mockDTO = new CreateBlockCommentDTO();

            const result = await controller.update(req as any, MOCK_BLOCK_ID, MOCK_COMMENT_ID, mockDTO);
    
            expect(result).toBeDefined();
            expect(service.update).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID, MOCK_COMMENT_ID, mockDTO);
            expect(result).toEqual(mockBlockComment);
        });  
    })

    describe('delete', () => {
        it('should delete a comment and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };

            const result = await controller.delete(req as any, MOCK_BLOCK_ID, MOCK_COMMENT_ID);
    
            expect(result).toBeDefined();
            expect(service.delete).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID, MOCK_COMMENT_ID);
            expect(result).toEqual(mockBlockComment);
        });  
    })
});
