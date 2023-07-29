import { Injectable } from '@nestjs/common';
import { BlockRepository } from './block.repository';
import { CreateBlockDTO } from './block.dto';
import { Block } from 'src/entity/block.entity';
import { User } from 'src/entity/user.entity';
import axios from 'axios';
import cheerio from 'cheerio';
import { UserRepository } from 'src/user/user.repository';
import { UserMessage } from 'src/user/user.message';

@Injectable()
export class BlockService {
    constructor(
        private readonly model: BlockRepository,
        private readonly userModel: UserRepository
    ) {}

    public async create(userId: string, createBlockDTO: CreateBlockDTO): Promise<Block> {
        try {
            const user = await this.userModel.getUser(userId);

            if (!user) {
                throw new Error(UserMessage.NOT_FOUND);
            }
        
            const msg: string = await this.callChatGPT(createBlockDTO.link);
            console.log(msg);
            const res = JSON.parse(msg);
            
            createBlockDTO.user = user;
            createBlockDTO.title = res.title;
            createBlockDTO.subtitle = res.subtitle;
            createBlockDTO.content = res.body;
            createBlockDTO.hashtag = res.hashtag;
        
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

    public async callChatGPT(url: string): Promise<string> {
        try {
            let html = "";
            let title = "";
            let subtitle = "";
            let body = "";

            await axios.get(url).then(response => {
                html = response.data;
                const $ = cheerio.load(html);
                title = $('h1').text();
                subtitle = $('h2').text();
                body = $('p').text();
            })
            .catch(console.error);

            const response = await axios.post(`${process.env.GPT_URL}/v1/chat/completions`, {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content:             
                `
                    다음은 내가 크롤링을 해서 받아온 URL의 본문이야.

                    body : ${body}
        
                    이 내용을 가지고 제목 및 부제목, 본문 요약본 및 해시태그를 만들어줘
                    이 글에 대한 답변은 CSS를 모두 제거하고 string 형식으로 본문은 최대 100자로 요약하여 다음과 같은 JSON 형식으로 답변해줘.
                    예시 답변 : { title : title, subtitle : subtitle, body: body, hashtag: a,b,c }
            ` }],
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            
            console.log(response);
            if (response.status === 200) {
                return response.data.choices[0].message.content;
            } else {
                return "";
            }
        } catch (error) {
            console.error("오류가 발생하였습니다.", error);
        }
    }
}
