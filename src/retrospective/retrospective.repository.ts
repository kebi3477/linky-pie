import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Retrospective } from "./retrospective.entity";
import { Repository, UpdateResult } from "typeorm";
import { CreateRetrospectiveDTO } from "./retrospective.dto";
import { Block } from "../block/block.entity";

@Injectable()
export class RetrospectiveRepository {
    public constructor(
        @InjectRepository(Retrospective)
        private readonly repository: Repository<Retrospective>,
    ) {}

    public createRetrospective(retrospective: CreateRetrospectiveDTO): Retrospective {
        return this.repository.create(retrospective);
    }
    
    public async getRetrospective(blockId: string, id: number): Promise<Retrospective> {
        return this.repository.findOne({ where: { id: id, block: new Block(blockId) } });
    }

    public async updateRetrospective(id: number, content: string): Promise<UpdateResult> {
        return this.repository.update(id, { content: content });
    }

    public async deleteRetrospective(id: number): Promise<void> {
        await this.repository.delete({ id : id });
    }

    public async save(retrospective: Retrospective) {
        return await this.repository.save(retrospective);
    }
}