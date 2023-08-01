import { Test, TestingModule } from '@nestjs/testing';
import { BlockGroupController } from './group.controller';

describe('BlockGroupsController', () => {
  let controller: BlockGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockGroupController],
    }).compile();

    controller = module.get<BlockGroupController>(BlockGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
