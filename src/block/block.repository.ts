import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, createQueryBuilder } from "typeorm";
import { Between } from 'typeorm';
import { Block } from "./block.entity";
import { CreateBlockDTO } from "./block.dto";
import { BlockGroup } from "../block-group/block-group.entity";
import { User } from "../user/user.entity";
import { UserLikesBlock } from "../userLikesBlock/userLikesBlock.entity";
import { BlockComment } from "src/block-comment/block-comment.entity";

@Injectable()
export class BlockRepository {
    public constructor(
        @InjectRepository(Block)
        private readonly repository: Repository<Block>,
        @InjectRepository(UserLikesBlock)
        private readonly likesBlockRepository: Repository<UserLikesBlock>,
        @InjectRepository(BlockComment)
        private readonly blockCommentRepository: Repository<BlockComment>,
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
    
        const likesCountQuery = this.likesBlockRepository.createQueryBuilder("ulb")
            .select("COALESCE(COUNT(ulb.id), 0)", "likesCount")
            .where("ulb.block_id = block.id")
            .getQuery();
            
        const amILikesQuery = this.likesBlockRepository.createQueryBuilder('ulb2')
            .select('COALESCE(COUNT(ulb2.id), 0)', 'amILikes')
            .where('ulb2.block_id = block.id')
            .andWhere('ulb2.user_id = :userId', { userId })
            .getQuery();
        
        const commentsCountQuery = this.blockCommentRepository.createQueryBuilder('comment')
            .select('COALESCE(COUNT(comment.id), 0)', 'commentsCount')
            .where('comment.block_id = block.id')
            .getQuery();
    
        const result = await this.repository.createQueryBuilder("block")
            .addSelect(`(${likesCountQuery})`, 'likesCount')
            .addSelect(`(${amILikesQuery})`, 'amILikes')
            .addSelect(`(${commentsCountQuery})`, 'commentsCount')
            .leftJoinAndSelect('block.user', 'user')
            .where('block.createdAt BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
            .andWhere('block.user = :userId', { userId })
            .groupBy("block.id, user.id")
            .orderBy("block.createdAt", "DESC")
            .getRawAndEntities();
    
        result.entities.forEach((block, index) => {
            block.likesCount = +result.raw[index].likesCount;
            block.amILikes = +result.raw[index].amILikes;
            block.commentsCount = +result.raw[index].commentsCount;
        });
    
        return result.entities;
    }

    public async getAllBlockList(userId: string): Promise<Block[]> {
        const likesCountQuery = this.likesBlockRepository.createQueryBuilder("ulb")
            .select("COALESCE(COUNT(ulb.id), 0)", "likesCount")
            .where("ulb.block_id = block.id")
            .getQuery();
            
        const amILikesQuery = this.likesBlockRepository.createQueryBuilder('ulb2')
            .select('COALESCE(COUNT(ulb2.id), 0)', 'amILikes')
            .where('ulb2.block_id = block.id')
            .andWhere(`ulb2.user_id = '${userId}'`)
            .getQuery();

        const commentsCountQuery = this.blockCommentRepository.createQueryBuilder('comment')
            .select('COALESCE(COUNT(comment.id), 0)', 'commentsCount')
            .where('comment.block_id = block.id')
            .getQuery();
    
        const result = await this.repository.createQueryBuilder("block")
            .addSelect(`(${likesCountQuery})`, 'likesCount')
            .addSelect(`(${amILikesQuery})`, 'amILikes')
            .addSelect(`(${commentsCountQuery})`, 'commentsCount')
            .leftJoinAndSelect('block.user', 'user')
            .groupBy("block.id, user.id")
            .orderBy("block.createdAt", "DESC")
            .getRawAndEntities();
    
        result.entities.forEach((block, index) => {
            block.likesCount = +result.raw[index].likesCount;
            block.amILikes = +result.raw[index].amILikes;
            block.commentsCount = +result.raw[index].commentsCount;
        });
    
        return result.entities;
    }
    
    public async getBlockListByGroup(blockGroup: BlockGroup): Promise<Block[]> {
        return await this.repository.find({ where: { blockGroup }, order: { createdAt: "DESC" } })
    }

    public async getBlockByUserId(blockId: string, userId: string): Promise<Block> {
        const likesCountQuery = this.likesBlockRepository.createQueryBuilder("ulb")
            .select("COALESCE(COUNT(ulb.id), 0)", "likesCount")
            .where("ulb.block_id = block.id")
            .getQuery();
            
        const amILikesQuery = this.likesBlockRepository.createQueryBuilder('ulb2')
            .select('COALESCE(COUNT(ulb2.id), 0)', 'amILikes')
            .where('ulb2.block_id = block.id')
            .andWhere(`ulb2.user_id = '${userId}'`)
            .getQuery();

        const commentsCountQuery = this.blockCommentRepository.createQueryBuilder('comment')
            .select('COALESCE(COUNT(comment.id), 0)', 'commentsCount')
            .where('comment.block_id = block.id')
            .getQuery();

        const result = await this.repository.createQueryBuilder("block")
            .addSelect(`(${likesCountQuery})`, 'likesCount')
            .addSelect(`(${amILikesQuery})`, 'amILikes')
            .addSelect(`(${commentsCountQuery})`, 'commentsCount')
            .leftJoinAndSelect('block.user', 'user')
            .where("block.id = :blockId", { blockId })
            .groupBy("block.id, user.id")
            .orderBy("block.createdAt", "DESC")
            .getRawAndEntities();

        if (result.entities.length > 0) {
            const block = result.entities[0];
            block.likesCount = +result.raw[0].likesCount;
            block.amILikes = +result.raw[0].amILikes;
            block.commentsCount = +result.raw[0].commentsCount;
            return block;
        }

        return null;
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