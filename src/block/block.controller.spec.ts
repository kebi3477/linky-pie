import { Test, TestingModule } from '@nestjs/testing';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { CreateBlockDTO, UpdateBlockDTO } from './block.dto';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { Block } from './block.entity';
import { UserLikesBlockRepository } from '../userLikesBlock/userLikesBlock.repository';

describe('BlockController', () => {
    let controller: BlockController;
    let service: BlockService;

    const MOCK_USER_ID = 'kebi3477';
    const MOCK_BLOCK_ID = "block_id";
    const mockBlock = new Block();
    
    const mockUserLikesBlockModel = {
        create: jest.fn(),
        read: jest.fn(),
        delete: jest.fn(),
        save: jest.fn(),
        getBlocksByUser: jest.fn(),
    }

    beforeEach(async () => {
        const mockBlockService = {
            create: jest.fn().mockImplementation((userId, groupId, createBlockDTO) => Promise.resolve(new Block())).mockReturnValue(new Block()),
            read: jest.fn().mockResolvedValue(new Block()).mockReturnValue(new Block()),
            update: jest.fn().mockResolvedValue(new Block()).mockReturnValue(new Block()),
            delete: jest.fn().mockResolvedValue(new Block()).mockReturnValue(new Block()),
            getBlockListByUser: jest.fn().mockResolvedValue(Array<Block>).mockReturnValue(new Block()),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [BlockController],
            providers: [
                { provide: BlockService, useValue: mockBlockService },
                { provide: UserLikesBlockRepository, useValue: mockUserLikesBlockModel },
            ],
        }).overrideGuard(JwtAuthenticationGuard)
        .useValue({ canActivate: jest.fn().mockReturnValue(true) })
        .compile();

        controller = module.get<BlockController>(BlockController);
        service = module.get<BlockService>(BlockService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a block and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };
            const mockDto = new CreateBlockDTO();
    
            const result = await controller.create(req as any, mockDto);
    
            expect(result).toBeDefined();
            expect(service.create).toHaveBeenCalledWith(MOCK_USER_ID, null, mockDto);
            expect(result).toEqual(mockBlock);
        });
    });
    
    describe('read', () => {
        it('should read a block and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };
    
            const result = await controller.read(req as any, MOCK_BLOCK_ID);
    
            expect(result).toBeDefined();
            expect(service.read).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID);
            expect(result).toEqual(mockBlock);
        });

        it('should return block list', async () => {
            const req = { user: { id: MOCK_USER_ID } };

            const result = await controller.getBlockList(req as any);
    
            expect(result).toBeDefined();
            expect(service.getBlockListByUser).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(result).toEqual(mockBlock);
        });
    });

    describe('update', () => {
        it('should update a block and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };
            const mockDto = new UpdateBlockDTO();

            const result = await controller.update(req as any, MOCK_BLOCK_ID, mockDto);
    
            expect(result).toBeDefined();
            expect(service.update).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID, mockDto);
            expect(result).toEqual(mockBlock);
        });
    });

    describe('delete', () => {
        it('should delete a block and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };

            const result: Block = await controller.delete(req as any, MOCK_BLOCK_ID);
    
            expect(result).toBeDefined();
            expect(service.delete).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID);
            expect(result).toEqual(mockBlock);
        });
    });
});
