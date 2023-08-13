import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Block } from "./block.entity";
import { CreateBlockDTO } from "./block.dto";
import { Group } from "../group/group.entity";
import { User } from "../user/user.entity";

@Injectable()
export class BlockRepository {
    public constructor(
        @InjectRepository(Block)
        private readonly repository: Repository<Block>,
    ) {}

    public create(createBlockDTO: CreateBlockDTO): Block {
        return this.repository.create(createBlockDTO);
    }
    
    public async read(id: string): Promise<Block> {
        return this.repository.findOne({ where: { id } });
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete({ id });
    }

    public async save(block: Block) {
        return await this.repository.save(block);
    }

    public async getBlockListByUser(user: User): Promise<Block[]> {
        return await this.repository.find({ where: { user }, order: { createdAt: "DESC" } })
    }

    public async getBlockListByGroup(group: Group): Promise<Block[]> {
        return await this.repository.find({ where: { group }, order: { createdAt: "DESC" } })
    }

    public async getBlockByUserId(blockId: string, userId: string): Promise<Block> {
        return this.repository.findOne({ where: { id: blockId, user: { id: userId } } });
    }
}