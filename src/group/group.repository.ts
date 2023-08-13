import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGroupDTO } from "./group.dto";
import { Group } from "./group.entity";
import { User } from "../user/user.entity";

@Injectable()
export class GroupRepository {
    public constructor(
        @InjectRepository(Group)
        private readonly repository: Repository<Group>,
    ) {}

    public create(createGroupDTO: CreateGroupDTO): Group {
        return this.repository.create(createGroupDTO);
    }
    
    public async read(id: string): Promise<Group> {
        return this.repository.findOne({ where: { id } });
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete({ id });
    }

    public async save(block: Group) {
        return await this.repository.save(block);
    }

    public async getGroupListByUserId(userId: string): Promise<Group[]> {
        return await this.repository.find({ where: { user : { id: userId } }, order: { createdAt: "DESC" } })
    }
}