import { Test, TestingModule } from '@nestjs/testing';
import { BlockCommentService } from './block-comment.service';
import { CreateBlockCommentDTO, UpdateBlockCommentDTO } from './block-comment.dto';
import { UserRepository } from '../user/user.repository';
import { BlockComment } from './block-comment.entity';
import { BlockCommentRepository } from './block-comment.repository';
import { Block } from '../block/block.entity';
import { BlockRepository } from '../block/block.repository';

describe('BlockCommentService', () => {
    let service: BlockCommentService;

    const MOCK_USER_ID = 'kebi3477';
    const MOCK_GROUP_ID = 'group_id';
    const MOCK_BLOCK_ID = 'block_id';
    const MOCK_BLOCK_COMMENT_ID = 1;
    const mockBlockComment = new BlockComment();
    const mockBlock = new Block();

    const mockBlockCommentModel = {
        create: jest.fn().mockReturnValue(mockBlockComment),
        read: jest.fn().mockReturnValue(mockBlockComment),
        update: jest.fn().mockReturnValue(mockBlockComment),
        delete: jest.fn().mockReturnValue(mockBlockComment),
        save: jest.fn().mockReturnValue(mockBlockComment),
        getListByBlockId: jest.fn().mockReturnValue(Array<BlockComment>),
    };

    const mockUserModel = {
        read: jest.fn().mockResolvedValue({ id: MOCK_USER_ID })
    };

    const mockBlockModel = {
        getBlockByUserId: jest.fn().mockReturnValue(mockBlock),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [ 
            BlockCommentService,
            { provide: BlockCommentRepository, useValue: mockBlockCommentModel },
            { provide: UserRepository, useValue: mockUserModel },
            { provide: BlockRepository, useValue: mockBlockModel },
        ],
        }).compile();

        service = module.get<BlockCommentService>(BlockCommentService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a block comment and return it', async () => {
            const mockCreateBlockCommentDTO = new CreateBlockCommentDTO();
        
            const result = await service.create(MOCK_USER_ID, MOCK_GROUP_ID, mockCreateBlockCommentDTO);
            
            expect(mockUserModel.read).toHaveBeenCalledTimes(1);
            expect(mockUserModel.read).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(result).toBeDefined();
            expect(result).toEqual(mockBlockComment);
        });
    
        it('should throw an error when user does not exist', async () => {
            const mockCreateBlockCommentDTO = new CreateBlockCommentDTO();

            mockUserModel.read.mockResolvedValueOnce(null);
    
            await expect(service.create('invalidUserId', MOCK_GROUP_ID, mockCreateBlockCommentDTO)).rejects.toThrow();
        });
    });

    describe('update', () => {
        it('should update a block comment and return it', async () => {
            const mockUpdateBlockCommentDTO = new UpdateBlockCommentDTO();
    
            const result = await service.update(MOCK_USER_ID, MOCK_BLOCK_ID, MOCK_BLOCK_COMMENT_ID, mockUpdateBlockCommentDTO);
            
            expect(mockUserModel.read).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(mockBlockModel.getBlockByUserId).toHaveBeenCalledWith(MOCK_BLOCK_ID, MOCK_USER_ID);
            expect(result).toBeDefined();
            expect(result).toEqual(mockBlock);
        });

        it('should throw an error if the block does not exist', async () => {
            const updateBlockCommentDTO = new UpdateBlockCommentDTO();

            mockBlockCommentModel.read.mockResolvedValueOnce(null);
    
            await expect(service.update(MOCK_USER_ID, MOCK_BLOCK_ID, 1234, updateBlockCommentDTO)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete a block comment and return it', async () => {
            const result = await service.delete(MOCK_USER_ID, MOCK_BLOCK_ID, MOCK_BLOCK_COMMENT_ID);
            
            expect(mockUserModel.read).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(mockBlockCommentModel.delete).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID, MOCK_BLOCK_COMMENT_ID);
            expect(result).toBeDefined();
            expect(result).toEqual(mockBlock);
        });

        it('should throw an error if the block does not exist', async () => {
            mockBlockCommentModel.read.mockResolvedValueOnce(null);
    
            await expect(service.delete(MOCK_USER_ID, MOCK_BLOCK_ID, 1234)).rejects.toThrow();
        });
    });
    
});
