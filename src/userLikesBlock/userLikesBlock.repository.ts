import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLikesBlock } from './userLikesBlock.entity';
import { Block } from '../block/block.entity';
import { User } from '../user/user.entity';

@Injectable()
export class UserLikesBlockRepository {
    public constructor(
        @InjectRepository(UserLikesBlock)
        private readonly repository: Repository<UserLikesBlock>
    ) {}

    public create(userId: string, blockId: string): UserLikesBlock {
        return this.repository.create({ user: { id: userId }, block: { id: blockId }});
    }
    
    public async read(userId: string, blockId: string): Promise<UserLikesBlock> {
        return this.repository.findOne({ where : { user: { id: userId }, block: { id: blockId } } });
    }

    public async delete(id: number): Promise<void> {
        await this.repository.delete({id : id});
    }

    public async save(userLikesBlock: UserLikesBlock): Promise<UserLikesBlock> {
        return await this.repository.save(userLikesBlock);
    }

    public async getBlocksByUser(userId: string): Promise<UserLikesBlock[]> {
        return await this.repository.find({ where: { user: { id: userId } }, relations: ['block'] })
    }
}