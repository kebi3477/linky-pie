import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Between } from 'typeorm';
import { Block } from "./block.entity";
import { CreateBlockDTO } from "./block.dto";
import { BlockGroup } from "../block-group/block-group.entity";
import { User } from "../user/user.entity";
import { UserLikesBlock } from "../userLikesBlock/userLikesBlock.entity";

@Injectable()
export class BlockRepository {
    public constructor(
        @InjectRepository(Block)
        private readonly repository: Repository<Block>,
        @InjectRepository(UserLikesBlock)
        private readonly likesBlockRepository: Repository<UserLikesBlock>
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

    public async getBlockListByUserDate(userId: string, date: string): Promise<Block[]> {
        const inputDate = new Date(date);
    
        const startOfDay = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate(), 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate(), 23, 59, 59, 999));
    
        const subQuery = this.likesBlockRepository.createQueryBuilder("ulb")
            .select("COALESCE(COUNT(ulb.id), 0)", "likesCount")
            .where("ulb.block_id = block.id")
            .getQuery();
    
        const result = await this.repository.createQueryBuilder("block")
            .addSelect(`(${subQuery})`, 'likesCount')
            .leftJoinAndSelect('block.user', 'user')
            .where('block.createdAt BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
            .andWhere('block.user = :userId', { userId })
            .groupBy("block.id, user.id")
            .orderBy("block.createdAt", "DESC")
            .getRawAndEntities();
    
        result.entities.forEach((block, index) => {
            block.likesCount = +result.raw[index].likesCount;
        });
    
        return result.entities;
    }
    
    public async getBlockListByGroup(blockGroup: BlockGroup): Promise<Block[]> {
        return await this.repository.find({ where: { blockGroup }, order: { createdAt: "DESC" } })
    }

    public async getBlockByUserId(blockId: string, userId: string): Promise<Block> {
        return this.repository.findOne({ where: { id: blockId, user: { id: userId } } });
    }

    public async getBlockCountsByWeek(userId: string, date: string): Promise<{ date: string, count: number }[]> {
        const startDate = new Date(date);
        const onlyDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
        const results: { date: string, count: number }[] = [];
    
        for (let i = 0; i < 7; i++) {
            const dayStart = new Date(onlyDate);
            dayStart.setDate(dayStart.getDate() + i);
            dayStart.setHours(0, 0, 0, 0)
            
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);
    
            const count = await this.repository.count({
                where: {
                    user: { id: userId },
                    createdAt: Between(dayStart, dayEnd)
                }
            });
    
            const dateString = dayStart.getFullYear() + "-" + (dayStart.getMonth() + 1) + "-" + dayStart.getDate();
            results.push({ date: dateString, count: count });
        }
    
        return results;
    }
}