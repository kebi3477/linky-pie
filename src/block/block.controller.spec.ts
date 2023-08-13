import { Test, TestingModule } from '@nestjs/testing';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { CreateBlockDTO, UpdateBlockDTO } from './block.dto';
import { JwtAuthenticationGuard } from '../auth/jwt.strategy';
import { Block } from './block.entity';
import { BlockMessage } from './block.message';
import { HttpStatus } from '@nestjs/common';

describe('BlockController', () => {
    let controller: BlockController;
    let service: BlockService;

    const MOCK_USER_ID = 'kebi3477';
    const MOCK_BLOCK_ID = "block_id";
    const mockBlock = new Block();
    
    beforeEach(async () => {
        const mockBlockService = {
            create: jest.fn().mockImplementation((userId, groupId, createBlockDTO) => Promise.resolve(new Block())),
            read: jest.fn().mockResolvedValue(new Block()),
            update: jest.fn().mockResolvedValue(new Block()),
            delete: jest.fn().mockResolvedValue(new Block()),
            getBlockListByUser: jest.fn().mockResolvedValue(Array<Block>),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [BlockController],
            providers: [
                {
                    provide: BlockService,
                    useValue: mockBlockService
                },
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
    
            const mockBlockResponseDto = {
                block: mockBlock,
                message: BlockMessage.SUCCESS_CREATE,
                statusCode: HttpStatus.CREATED,
            };

            const result = await controller.create(req as any, mockDto);
    
            expect(result).toBeDefined();
            expect(service.create).toHaveBeenCalledWith(MOCK_USER_ID, null, mockDto);
            expect(result).toEqual(mockBlockResponseDto);
        });
    });
    
    describe('read', () => {
        it('should read a block and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };
    
            const mockBlockResponseDto = {
                block: mockBlock,
                message: BlockMessage.SUCCESS_READ,
                statusCode: HttpStatus.OK,
            };

            const result = await controller.read(req as any, MOCK_BLOCK_ID);
    
            expect(result).toBeDefined();
            expect(service.read).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID);
            expect(result).toEqual(mockBlockResponseDto);
        });

        it('should return block list', async () => {
            const req = { user: { id: MOCK_USER_ID } };

            const mockBlockResponseDto = {
                block: Array<Block>,
                message: BlockMessage.SUCCESS_READ,
                statusCode: HttpStatus.OK,
            };

            const result = await controller.getBlockList(req as any);
    
            expect(result).toBeDefined();
            expect(service.getBlockListByUser).toHaveBeenCalledWith(MOCK_USER_ID);
            expect(result).toEqual(mockBlockResponseDto);
        });
    });

    describe('update', () => {
        it('should update a block and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };
            const mockDto = new UpdateBlockDTO();

            const mockBlockResponseDto = {
                block: mockBlock,
                message: BlockMessage.SUCCESS_UPDATE,
                statusCode: HttpStatus.OK,
            };

            const result = await controller.update(req as any, MOCK_BLOCK_ID, mockDto);
    
            expect(result).toBeDefined();
            expect(service.update).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID, mockDto);
            expect(result).toEqual(mockBlockResponseDto);
        });
    });

    describe('delete', () => {
        it('should delete a block and return it', async () => {
            const req = { user: { id: MOCK_USER_ID } };

            const mockBlockResponseDto = {
                block: mockBlock,
                message: BlockMessage.SUCCESS_DELETE,
                statusCode: HttpStatus.OK,
            };

            const result = await controller.delete(req as any, MOCK_BLOCK_ID);
    
            expect(result).toBeDefined();
            expect(service.delete).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_BLOCK_ID);
            expect(result).toEqual(mockBlockResponseDto);
        });
    });
});
