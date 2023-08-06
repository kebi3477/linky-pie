import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Block } from "src/block/block.entity";
import { Repository } from "typeorm";
import { CreateGroupDTO } from "./group.dto";
import { Group } from "src/group/group.entity";
import { User } from "src/user/user.entity";


@Injectable()
export class GroupRepository {
    public constructor(
        @InjectRepository(Group)
        private readonly repository: Repository<Group>,
    ) {}

    public createGroup(blockGroup: CreateGroupDTO): Group {
        return this.repository.create(blockGroup);
    }
    
    public async getGroup(id: string): Promise<Group> {
        return this.repository.findOne({ where: { id: id } });
    }

    public async deleteGroup(id: string): Promise<void> {
        await this.repository.delete({id : id});
    }

    public async save(block: Group) {
        return await this.repository.save(block);
    }

    public async getGroupListByUser(user: User): Promise<Group[]> {
        return await this.repository.find({ where: { user : user }, order: { createdAt: "DESC" } })
    }
}