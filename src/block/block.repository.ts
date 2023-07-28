import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Block } from "src/entity/block.entity";
import { Repository } from "typeorm";
import { CreateBlockDTO } from "./block.dto";
import { User } from "src/entity/user.entity";


@Injectable()
export class BlockRepository {
    public constructor(
        @InjectRepository(Block)
        private readonly repository: Repository<Block>,
    ) {}

    public createBlock(block: CreateBlockDTO): Block {
        return this.repository.create(block);
    }
    
    public async getBlock(id: string): Promise<Block> {
        return this.repository.findOne({ where: { id: id } });
    }

    public async deleteBlock(id: string): Promise<void> {
        await this.repository.delete({id : id});
    }

    public async save(block: Block) {
        return await this.repository.save(block);
    }

    public async getBlockListByUser(user: User): Promise<Block[]> {
        return await this.repository.find({ where: { user : user }, order: { createdAt: "DESC" } })
    }
}