import { Injectable } from '@nestjs/common';
import { BlockRepository } from './block.repository';
import { CreateBlockDTO } from './block.dto';
import { Block } from 'src/entity/block.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entity/user.entity';
import { Config, openapiGenerate } from 'openapi';
import fetch from 'node-fetch';
import axios from 'axios';

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

    public async callChatGPT(url: string) {
        try {
            const response = await axios.post(`${process.env.GPT_URL}/v1/chat/completions`, {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: "야!" }],
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.GPT_SECRET}`,
                    "Content-Type": "application/json",
                },
            });
    
            console.log(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error("오류가 발생하였습니다.", error);
        }
    }
}
