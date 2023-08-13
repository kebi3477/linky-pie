import { Injectable } from '@nestjs/common';
import { BlockRepository } from './block.repository';
import { CreateBlockDTO, UpdateBlockDTO } from './block.dto';
import { Block } from './block.entity';
import axios from 'axios';
import cheerio from 'cheerio';
import { UserRepository } from '../user/user.repository';
import { UserMessage } from '../user/user.message';
import { BlockMessage } from './block.message';
import { Logger } from '../module/logger';
import { Group } from '../group/group.entity';
import { GroupRepository } from '../group/group.repository';
import { UserLikesBlock } from '../userLikesBlock/userLikesBlock.entity';
import { User } from '../user/user.entity';
import { UserLikesBlockRepository } from '../userLikesBlock/userLikesBlock.repository';
import { UserLikesBLockMessage } from '../userLikesBlock/userLikesBlock.message';

@Injectable()
export class BlockService {
    private logger = new Logger(BlockService.name).getLogger();

    constructor(
        private readonly model: BlockRepository,
        private readonly userModel: UserRepository,
        private readonly groupModel: GroupRepository,
        private readonly userLikesBlockModel: UserLikesBlockRepository
    ) {}

    /**
     * 블록 생성
     * 
     * @param userId 사용자ID
     * @param groupId 그룹ID
     * @param createBlockDTO 블록 생성 DTO
     * @returns 생성한 Block
     */
    public async create(userId: string, groupId: null|string, createBlockDTO: CreateBlockDTO): Promise<Block> {
        try {
            this.logger.log(`[블록 생성] API 호출 [ userId : ${userId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 생성] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const contents: string = await this.getContentsByURL(createBlockDTO.link);
            if (!contents) {
                this.logger.log(`[블록 생성] 크롤링 실패`);
                throw new Error(BlockMessage.NOT_FOUND_CONTENT);
            }

            const msg: string = await this.callChatGPT(contents);
            if (!msg) {
                this.logger.log(`[블록 생성] GPT 호출 실패 [ msg : ${msg} ] `);
                throw new Error(BlockMessage.GPT_ERROR);
            }

            const res = JSON.parse(msg);
            
            if (groupId !== null) {
                const group: Group = await this.groupModel.read(groupId);
                createBlockDTO.group = group;
            } else {
                createBlockDTO.group = null;
            }

            createBlockDTO.user = user;
            createBlockDTO.title = res.title;
            createBlockDTO.subtitle = res.subtitle;
            createBlockDTO.content = res.body;
            createBlockDTO.hashtag = res.hashtag;
        
            this.logger.log(`[블록 생성] 시작 [ title : ${res.title} ] `);
            const newBlock: Block = this.model.create(createBlockDTO);
            this.logger.log(`[블록 생성] 성공 [ id : ${newBlock.id} ] `);
            return await this.model.save(newBlock);
        } catch (error) {
            this.logger.error(`[블록 생성] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 블록 조회
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     */
    public async read(userId: string, blockId: string): Promise<Block> {
        try {
            this.logger.log(`[블록 조회] API 호출 [ userId : ${userId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.model.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[블록 조회] 실패 [ blockId : ${block}, userId : ${userId} ] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }

            this.logger.log(`[블록 조회] 성공 [ blockId : ${blockId} ] `);
            return block;
        } catch (error) {
            this.logger.error(`[블록 조회] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 블록 수정
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     * @param updateBlockDTO 블록 수정 DTO
     * @return 수정한 블록
     */
    public async update(userId: string, blockId: string, updateBlockDTO: UpdateBlockDTO): Promise<Block> {
        try {
            this.logger.log(`[블록 수정] API 호출 [ userId : ${userId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 수정] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.model.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[블록 수정] 실패 [ blockId : ${block}, userId : ${userId} ] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }
            
            Object.assign(block, updateBlockDTO);
            this.logger.log(`[블록 수정] 성공 [ blockId : ${blockId} ] `);

            return await this.model.save(block);
        } catch (error) {
            this.logger.error(`[블록 수정] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 블록 삭제
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     */
    public async delete(userId: string, blockId: string): Promise<Block> {
        try {
            this.logger.log(`[블록 삭제] API 호출 [ userId : ${userId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 삭제] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.model.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[블록 삭제] 실패 [ blockId : ${blockId}, userId : ${userId} ] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }

            await this.model.delete(blockId);
            this.logger.log(`[블록 삭제] 성공 [ blockId : ${blockId} ] `);
            
            return block;
        } catch (error) {
            this.logger.error(`[블록 삭제] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 블록 목록 조회 (사용자ID)
     * 
     * @param userId 사용자 ID
     * @returns Block[]
     */
    public async getBlockListByUser(userId: string): Promise<Block[]> {
        try {
            this.logger.log(`[블록 목록 조회] API 호출 [ userId : ${userId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 목록 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            return await this.model.getBlockListByUser(user);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * 블록 목록 조회
     * 
     * @param blockGroupId 블록 그룹 ID
     * @returns Block[]
     */
    public async getBlockList(blockGroupId: string): Promise<Block[]> {
        try {
            this.logger.log(`[블록 목록 조회] API 호출 [ blockGroupId : ${blockGroupId} ]`);

            const blockGroup: Group = new Group();
            blockGroup.id = blockGroupId;

            return await this.model.getBlockListByGroup(blockGroup);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * 블록 좋아요 생성
     * 
     * @param userId 사용자 ID
     * @param blockId 블록 ID
     * @returns 좋아요 정보
     */
    public async createLikes(userId: string, blockId: string): Promise<UserLikesBlock> {
        try {
            this.logger.log(`[블록 좋아요] API 호출 [ userId : ${userId} ]`);

            const user: User = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 좋아요] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.model.read(blockId);
            if (!block) {
                this.logger.log(`[블록 좋아요] 실패 [ blockId : ${blockId} ] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }

            const isExisted: UserLikesBlock = await this.userLikesBlockModel.read(userId, blockId);
            if (isExisted) {
                this.logger.log(`[블록 좋아요] 실패 [ blockId : ${blockId} ] -> 이미 좋아요를 했습니다.`);
                throw new Error(UserLikesBLockMessage.CONFLICT);
            }
        
            this.logger.log(`[블록 좋아요] 시작 [ blockId : ${blockId} ]`);
            const likes: UserLikesBlock = this.userLikesBlockModel.create(userId, blockId);
            this.logger.log(`[블록 좋아요] 성공 [ id : ${likes.id} ] `);
            return await this.userLikesBlockModel.save(likes);
        } catch (error) {
            this.logger.error(`[블록 좋아요] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 블록 좋아요 취소
     * 
     * @param userId 
     * @param blockId 
     * @returns 좋아요 정보
     */
    public async deleteLikes(userId: string, blockId: string): Promise<UserLikesBlock> {
        try {
            this.logger.log(`[블록 좋아요 취소] API 호출 [ userId : ${userId} ]`);

            const user: User = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 좋아요 취소] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.model.read(blockId);
            if (!block) {
                this.logger.log(`[블록 좋아요 취소] 실패 [ blockId : ${blockId} ] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }

            const likes: UserLikesBlock = await this.userLikesBlockModel.read(userId, blockId);
            if (!likes) {
                this.logger.log(`[블록 좋아요 취소] 실패 [ blockId : ${blockId} ] -> 좋아요를 찾을 수 없습니다.`);
                throw new Error(UserLikesBLockMessage.NOT_FOUND);
            }
        
            this.logger.log(`[블록 좋아요 취소] 시작 [ blockId : ${blockId} ]`);
            this.userLikesBlockModel.delete(likes.id);
            this.logger.log(`[블록 좋아요 취소] 성공 [ id : ${likes.id} ] `);

            return likes;
        } catch (error) {
            this.logger.error(`[블록 좋아요 취소] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 좋아요한 블록 목록 조회
     * 
     * @param userId 블록 그룹 ID
     * @returns Block[]
     */
    public async getLikesBlockList(userId: string): Promise<Block[]> {
        try {
            this.logger.log(`[좋아요 블록 목록 조회] API 호출 [ userId : ${userId} ]`);

            const userLikesBlocks: UserLikesBlock[] = await this.userLikesBlockModel.getBlocksByUser(userId);
            const likedBlocks: Block[] = userLikesBlocks.map(ulb => ulb.block);

            return likedBlocks;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * URL 크롤링 후 p 태그의 내용 반환
     * 
     * @param url 웹 URL
     * @returns 
     */
    private async getContentsByURL(url: string): Promise<string> {
        this.logger.log(`[크롤링] 시작 [ URL : ${url} ]`);

        let body = "";

        await axios.get(url).then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            body = $('p').text();
        })
        .catch(error => {
            this.logger.error(`[크롤링] 오류 출력 [ error : ${error.message} ]`);
        });

        this.logger.log(`[크롤링] 성공`);
        return body;
    }

    /**
     * GPT에게 본문 내용으로 JSON 요청
     * 
     * @param contents 본문 내용
     * @returns GPT에게 요청한 본문 내용으로 받은 요약본
     */
    private async callChatGPT(contents: string): Promise<string> {
        try {
            this.logger.log(`[GPT 호출] 시작`);
            
            const response = await axios.post(`${process.env.GPT_URL}/v1/chat/completions`, {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: this.getPrompt(contents) }],
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            
            if (response.status === 200) {
                this.logger.log(`[GPT 호출] 성공`);
                return response.data.choices[0].message.content;
            } else {
                console.log(response);
                this.logger.log(`[GPT 호출] 실패`);
                return "";
            }
        } catch (error) {
            this.logger.log(`[GPT 호출] 오류 출력 [ error : ${error.message} ]`);
        }
    }

    /**
     * 프롬프트 문자열 반환
     * 
     * @param contents 본문 내용
     * @returns 프롬프트
     */
    private getPrompt(contents: string): string {
        return `
            다음은 내가 크롤링을 해서 받아온 URL의 본문이야.

            contents : ${contents}

            이 내용을 가지고 제목 및 부제목, 본문 요약본 및 해시태그를 만들어줘
            이 글에 대한 답변은 CSS를 모두 제거하고 string 형식으로 본문은 최대 100자로 요약하여 다음과 같은 JSON 형식으로 답변해줘.
            예시 답변 : { title : title, subtitle : subtitle, body: body, hashtag: a,b,c }
        `;
    }
}
