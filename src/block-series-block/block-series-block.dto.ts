import { IsInt } from "class-validator";
import { BlockSeries } from "src/block-series/block-series.entity";
import { Block } from "src/block/block.entity";

export class CreateBlockSeriesBlockDTO {
    @IsInt()
    index: number;
    
    block: Block;

    blockSeries: BlockSeries;
}

export class UpdateBlockSeriesBlockDTO {
    @IsInt()
    index: number;    
}