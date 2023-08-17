import { Test, TestingModule } from '@nestjs/testing';
import { BlockSeriesController } from './block-series.controller';

describe('BlockSeriesController', () => {
  let controller: BlockSeriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockSeriesController],
    }).compile();

    controller = module.get<BlockSeriesController>(BlockSeriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
