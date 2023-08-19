import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlockSeries } from "./block-series.entity";
import { Repository } from "typeorm";
import { CreateBlockSeriesDTO } from "./block-series.dto";

@Injectable()
export class BlockSeriesRepository {
    public constructor(
        @InjectRepository(BlockSeries)
        private readonly repository: Repository<BlockSeries>,
    ) {}

    public create(CreateBlockSeriesDTO: CreateBlockSeriesDTO): BlockSeries {
        return this.repository.create(CreateBlockSeriesDTO);
    }
    
    public async read(id: string, userId: string): Promise<BlockSeries> {
        return this.repository.findOne({ where: { id, user: { id: userId } } });
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete({ id });
    }

    public async save(block: BlockSeries) {
        return await this.repository.save(block);
    }

    public async getSeriesListByUserId(userId: string): Promise<BlockSeries[]> {
        return await this.repository.find({ where: { user: { id: userId }} })
    }
}