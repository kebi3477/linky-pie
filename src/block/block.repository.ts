import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Between } from 'typeorm';
import { Block } from "./block.entity";
import { CreateBlockDTO } from "./block.dto";
import { BlockGroup } from "../block-group/block-group.entity";
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

    public async getBlockListByGroup(blockGroup: BlockGroup): Promise<Block[]> {
        return await this.repository.find({ where: { blockGroup }, order: { createdAt: "DESC" } })
    }

    public async getBlockByUserId(blockId: string, userId: string): Promise<Block> {
        return this.repository.findOne({ where: { id: blockId, user: { id: userId } } });
    }

    public async getBlockCountsByWeek(userId: string, date: string): Promise<{ date: string, count: number }[]> {
        const startDate = new Date(date);
        const results: { date: string, count: number }[] = [];
    
        for (let i = 0; i < 7; i++) {
            const dayStart = new Date(startDate);
            dayStart.setDate(dayStart.getDate() + i);
            dayStart.setHours(0, 0, 0, 0)
    
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999); // set to end of the day
    
            const count = await this.repository.count({
                where: {
                    user: { id: userId },
                    createdAt: Between(dayStart, dayEnd)
                }
            });
    
            results.push({ date: dayStart.toISOString().split('T')[0], count: count });
        }
    
        return results;
    }
}