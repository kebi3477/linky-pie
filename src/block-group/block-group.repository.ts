import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateBlockGroupDTO } from "./block-group.dto";
import { BlockGroup } from "./block-group.entity";
import { User } from "../user/user.entity";

@Injectable()
export class GroupRepository {
    public constructor(
        @InjectRepository(BlockGroup)
        private readonly repository: Repository<BlockGroup>,
    ) {}

    public create(CreateBlockGroupDTO: CreateBlockGroupDTO): BlockGroup {
        return this.repository.create(CreateBlockGroupDTO);
    }
    
    public async read(id: string): Promise<BlockGroup> {
        return this.repository.findOne({ where: { id } });
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete({ id });
    }

    public async save(block: BlockGroup) {
        return await this.repository.save(block);
    }

    public async getGroupListByUserId(userId: string): Promise<BlockGroup[]> {
        return await this.repository.find({ where: { user : { id: userId } }, order: { createdAt: "DESC" } })
    }
}