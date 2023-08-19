import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { BlockSeriesBlock } from "./block-series-block.entity";
import { CreateBlockSeriesBlockDTO } from "./block-series-block.dto";
import { Block } from "src/block/block.entity";

@Injectable()
export class BlockSeriesBlockRepository {
    public constructor(
        @InjectRepository(BlockSeriesBlock)
        private readonly repository: Repository<BlockSeriesBlock>,
        @InjectRepository(Block)
        private readonly blockRepository: Repository<Block>,
    ) {}

    public create(createBlockSeriesBlockDTO: CreateBlockSeriesBlockDTO): BlockSeriesBlock {
        return this.repository.create(createBlockSeriesBlockDTO);
    }
    
    public async read(seriesId: string, blockId: string): Promise<BlockSeriesBlock> {
        return this.repository.findOne({ where: { blockSeries: { id: seriesId }, block: { id: blockId }} });
    }

    public async update(seriesId: string, blockId: string, index: number): Promise<UpdateResult> {
        return this.repository.update({ blockSeries: { id: seriesId }, block: { id: blockId }}, { index });
    }

    public async delete(seriesId: string, blockId: string): Promise<void> {
        await this.repository.delete({ blockSeries: { id: seriesId }, block: { id: blockId }});
    }

    public async save(block: BlockSeriesBlock): Promise<BlockSeriesBlock> {
        return await this.repository.save(block);
    }

    public async getListSeriesBlocks(seriesId: string): Promise<Block[]> {
        return await this.blockRepository
                         .createQueryBuilder('block')
                         .innerJoin('block.blockSeriesConnection', 'bsb')
                         .where('bsb.block_series_id = :seriesId', { seriesId })
                         .orderBy('bsb.index') 
                         .getMany();
    }
}