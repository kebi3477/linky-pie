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

    public create(createRetrospectiveDTO: CreateRetrospectiveDTO): Retrospective {
        return this.repository.create(createRetrospectiveDTO);
    }
    
    public async read(blockId: string, id: number): Promise<Retrospective> {
        return this.repository.findOne({ where: { id, block: { id: blockId } } });
    }

    public async update(id: number, content: string): Promise<UpdateResult> {
        return this.repository.update(id, { content: content });
    }

    public async delete(id: number): Promise<void> {
        await this.repository.delete({ id });
    }

    public async save(retrospective: Retrospective) {
        return await this.repository.save(retrospective);
    }
}