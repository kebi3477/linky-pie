import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from './block.service';
import { BlockRepository } from './block.repository';
import { UserRepository } from '../user/user.repository';
import { GroupRepository } from '../block-group/block-group.repository';
import { CreateBlockDTO, UpdateBlockDTO } from './block.dto';
import { Block } from './block.entity';
import { User } from '../user/user.entity';
import { UserLikesBlockRepository } from '../userLikesBlock/userLikesBlock.repository';

describe('BlockService', () => {
    let service: BlockService;
    let userModel: UserRepository;

    const MOCK_USER_ID = 'kebi3477';
    const MOCK_GROUP_ID = 'group_id';
    const MOCK_BLOCK_ID = 'block_id';
    const mockBlock = new Block();
    const mockUser = new User();

    const mockBlockModel = {
        create: jest.fn().mockReturnValue(mockBlock),
        read: jest.fn().mockReturnValue(mockBlock),
        delete: jest.fn(),
        save: jest.fn().mockReturnValue(mockBlock),
        getBlockListByUser: jest.fn().mockReturnValue(Array<Block>),
        getBlockListByGroup: jest.fn().mockReturnValue(Array<Block>),
        getBlockByUserId: jest.fn().mockReturnValue(mockBlock),
    };

    const mockUserModel = {
        read: jest.fn().mockResolvedValue({ id: MOCK_USER_ID })
    };

    const mockGroupModel = {
        read: jest.fn()
    };

    const mockUserLikesBlockModel = {
        create: jest.fn(),
        read: jest.fn(),
        delete: jest.fn(),
        save: jest.fn(),
        getBlocksByUser: jest.fn(),
    }

    const mockGetContentsByURL = jest.fn().mockResolvedValue("expected contents");
    const mockCallChatGPT = jest.fn().mockResolvedValue(JSON.stringify({
        title: "mockTitle",
        subtitle: "mockSubtitle",
        body: "mockContent",
        hashtag: "mockHashtag"
    }));

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BlockService,
                { provide: BlockRepository, useValue: mockBlockModel },
                { provide: UserRepository, useValue: mockUserModel },
                { provide: GroupRepository, useValue: mockGroupModel },
                { provide: UserLikesBlockRepository, useValue: mockUserLikesBlockModel },
                
            ]
        }).compile();
    
        service = module.get<BlockService>(BlockService);
        userModel = module.get<UserRepository>(UserRepository);

        (service as any).getContentsByURL = mockGetContentsByURL;
        (service as any).callChatGPT = mockCallChatGPT;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a block and return it', async () => {
            const mockCreateBlockDTO = new CreateBlockDTO();
            const mockUser = new User();
            mockUser.id = MOCK_USER_ID;
        
            const result = await service.create(mockUser.id, MOCK_GROUP_ID, mockCreateBlockDTO);
            
            expect(userModel.read).toHaveBeenCalledTimes(1);
            expect(userModel.read).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(result).toBeDefined();
            expect(result).toEqual(mockBlock);
        });
    
        it('should throw an error when user does not exist', async () => {
            mockUserModel.read.mockResolvedValueOnce(null);
    
            await expect(service.create('invalidUserId', MOCK_GROUP_ID, new CreateBlockDTO())).rejects.toThrow();
        });
    });
    

    describe('read', () => {
        it('should read a block and return it', async () => {
            const mockUser = new User();
            mockUser.id = MOCK_USER_ID;
    
            const result = await service.read(mockUser.id, MOCK_BLOCK_ID);
            
            expect(userModel.read).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(result).toBeDefined();
            expect(result).toEqual(mockBlock);
        });

        it('should read block list by user id and return it', async () => {
            const mockUser = new User();
            mockUser.id = MOCK_USER_ID;
    
            const result = await service.getBlockListByUser(mockUser.id);
            
            expect(userModel.read).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(result).toBeDefined();
            expect(result).toEqual(Array<Block>);
        });

        it('should read block list by group id and return it', async () => {
            const result = await service.getBlockList(MOCK_GROUP_ID);
            
            expect(result).toBeDefined();
            expect(result).toEqual(Array<Block>);
        });

        it('should return an empty array when there are no blocks for the user', async () => {
            mockBlockModel.getBlockListByUser.mockReturnValueOnce([]);
    
            const mockUser = new User();
            mockUser.id = MOCK_USER_ID;

            const result = await service.getBlockListByUser(mockUser.id);
            
            expect(userModel.read).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(result).toBeDefined();
            expect(result).toEqual([]);
        });
    });

    describe('update', () => {
        it('should update a block and return it', async () => {
            const mockUpdateBlockDTO = new UpdateBlockDTO();
            const mockUser = new User();
            mockUser.id = MOCK_USER_ID;
    
            const result = await service.update(mockUser.id, MOCK_BLOCK_ID, mockUpdateBlockDTO);
            
            expect(userModel.read).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(mockBlockModel.getBlockByUserId).toHaveBeenCalledWith(MOCK_BLOCK_ID, MOCK_USER_ID);
            expect(result).toBeDefined();
            expect(result).toEqual(mockBlock);
        });

        it('should throw an error if the block does not exist', async () => {
            mockBlockModel.getBlockByUserId.mockResolvedValueOnce(null);
    
            await expect(service.update(MOCK_USER_ID, 'INVALID_BLOCK_ID', new UpdateBlockDTO())).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete a block and return it', async () => {
            const mockUser = new User();
            mockUser.id = MOCK_USER_ID;
    
            const result = await service.delete(mockUser.id, MOCK_BLOCK_ID);
            
            expect(userModel.read).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(mockBlockModel.delete).toHaveBeenCalledWith(MOCK_BLOCK_ID);
            expect(result).toBeDefined();
            expect(result).toEqual(mockBlock);
        });

        it('should throw an error if the block does not exist', async () => {
            mockBlockModel.getBlockByUserId.mockResolvedValueOnce(null);
    
            await expect(service.delete(MOCK_USER_ID, 'INVALID_BLOCK_ID')).rejects.toThrow();
        });
    });
});
