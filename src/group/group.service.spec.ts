import { Test, TestingModule } from '@nestjs/testing';
import { BlockGroupsService } from './group.service';

describe('BlockGroupsService', () => {
  let service: BlockGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockGroupsService],
    }).compile();

    service = module.get<BlockGroupsService>(BlockGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
