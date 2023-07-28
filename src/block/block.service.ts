import { Injectable } from '@nestjs/common';
import { BlockRepository } from './block.repository';
import { CreateBlockDTO } from './block.dto';
import { Block } from 'src/entity/block.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entity/user.entity';

@Injectable()
export class BlockService {
    constructor(
        private readonly model: BlockRepository
    ) {}

    public async create(createBlockDTO: CreateBlockDTO): Promise<Block> {
        try {
            const newBlock: Block = this.model.createBlock(createBlockDTO);
            return await this.model.save(newBlock);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async getBlockList(userId: string): Promise<Block[]> {
        try {
            const user: User = new User();
            user.id = userId;

            return await this.model.getBlockListByUser(user);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
