import { BlockSeries } from "src/block-series/block-series.entity";
import { Block } from "src/block/block.entity";
import { Column, Entity, IsNull, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('block_series_block')
export class BlockSeriesBlock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    index: number;

    @ManyToOne(() => BlockSeries, blockSeries => blockSeries.blocksConnection)
    @JoinColumn({ name: 'block_series_id' })
    blockSeries: BlockSeries;

    @ManyToOne(() => Block, block => block.blockSeriesConnection)
    @JoinColumn({ name: 'block_id' })
    block: Block;
}