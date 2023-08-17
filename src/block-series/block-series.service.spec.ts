import { Test, TestingModule } from '@nestjs/testing';
import { BlockSeriesService } from './block-series.service';

describe('BlockSeriesService', () => {
  let service: BlockSeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockSeriesService],
    }).compile();

    service = module.get<BlockSeriesService>(BlockSeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
