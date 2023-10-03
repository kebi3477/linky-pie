import { Injectable } from '@nestjs/common';
import { BlockRepository } from './block.repository';
import { CreateBlockDTO, UpdateBlockDTO } from './block.dto';
import { Block } from './block.entity';
import axios from 'axios';
import cheerio from 'cheerio';
import { UserRepository } from '../user/user.repository';
import { Logger } from '../module/logger';
import { BlockGroup } from '../block-group/block-group.entity';
import { GroupRepository } from '../block-group/block-group.repository';
import { UserLikesBlock } from '../userLikesBlock/userLikesBlock.entity';
import { User } from '../user/user.entity';
import { UserLikesBlockRepository } from '../userLikesBlock/userLikesBlock.repository';
import { UserNotFoundError } from 'src/user/user.error';
import { BlockNotFoundError, BlockServerError } from './block.error';
import { UserLikesBlockConflictError, UserLikesBlockNotFoundError } from 'src/userLikesBlock/userLikesBlock.error';

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
        this.logger.log(`[블록 생성] API 호출 [ userId : ${userId}, groupId : ${groupId} ]`);

        const user = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[블록 생성] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        const { title, subtitle, content } = await this.getContentsByURL(createBlockDTO.link);
        if (!title) {
            this.logger.log(`[블록 생성] 크롤링 실패`);
            throw new BlockNotFoundError('URL 정보를 가져오지 못했습니다.');
        }

        createBlockDTO.title = title;
        createBlockDTO.content = subtitle;

        const msg: string = await this.callChatGPT(content);
        if (msg) {
            try {
                const res = JSON.parse(msg);

                createBlockDTO.content = res.body;
                createBlockDTO.hashtag = res.hashtag;
            } catch (err) {
                this.logger.error(`JSON Paring Error! msg : ${msg}`)
            }
        }

        this.logger.log(`[블록 생성] GPT 호출 실패 [ msg : ${msg} ] `);
        
        if (groupId !== null) {
            this.logger.log(`[블록 생성] 그룹 조회 [ groupId : ${groupId} ] `);
            const group: BlockGroup = await this.groupModel.read(groupId);
            createBlockDTO.blockGroup = group;
        } else {
            createBlockDTO.blockGroup = null;
        }

        createBlockDTO.user = user;
    
        this.logger.log(`[블록 생성] 시작 [ title : ${createBlockDTO.title} ] `);
        const newBlock: Block = this.model.create(createBlockDTO);
        this.logger.log(`[블록 생성] 성공 [ id : ${newBlock.id} ] `);

        return await this.model.save(newBlock);
    }

    /**
     * 블록 조회
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     */
    public async read(userId: string, blockId: string): Promise<Block> {
        this.logger.log(`[블록 조회] API 호출 [ userId : ${userId} ]`);

        const user = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[블록 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        const block: Block = await this.model.getBlockByUserId(blockId, userId);
        if (!block) {
            this.logger.log(`[블록 조회] 실패 [ blockId : ${block}, userId : ${userId} ] -> 블록을 찾을 수 없음`);
            throw new BlockNotFoundError();
        }

        this.logger.log(`[블록 조회] 성공 [ blockId : ${blockId} ] `);
        return block;
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
        this.logger.log(`[블록 수정] API 호출 [ userId : ${userId} ]`);

        const user = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[블록 수정] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        const block: Block = await this.model.getBlockByUserId(blockId, userId);
        if (!block) {
            this.logger.log(`[블록 수정] 실패 [ blockId : ${block}, userId : ${userId} ] -> 블록을 찾을 수 없음`);
            throw new BlockNotFoundError();
        }
        
        Object.assign(block, updateBlockDTO);
        this.logger.log(`[블록 수정] 성공 [ blockId : ${blockId} ] `);

        return await this.model.save(block);
    }

    /**
     * 블록 삭제
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     */
    public async delete(userId: string, blockId: string): Promise<Block> {
        this.logger.log(`[블록 삭제] API 호출 [ userId : ${userId} ]`);

        const user = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[블록 삭제] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        const block: Block = await this.model.getBlockByUserId(blockId, userId);
        if (!block) {
            this.logger.log(`[블록 삭제] 실패 [ blockId : ${blockId}, userId : ${userId} ] -> 블록을 찾을 수 없음`);
            throw new BlockNotFoundError();
        }

        await this.model.delete(blockId);
        this.logger.log(`[블록 삭제] 성공 [ blockId : ${blockId} ] `);
        
        return block;
    }

    /**
     * 블록 목록 조회 (사용자ID)
     * 
     * @param userId 사용자 ID
     * @returns Block[]
     */
    public async getBlockListByUser(userId: string, date: string=''): Promise<Block[]> {
        this.logger.log(`[블록 목록 조회] API 호출 [ userId : ${userId}, date: ${date} ]`);

        const user = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[블록 목록 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        if (date) {
            return await this.model.getBlockListByUserDate(userId, date);
        }

        return await this.model.getBlockListByUser(user);
    }

    /**
     * 메인 페이지 모든 블록 검색
     * @param userId 사용자 ID
     * @returns Bloc[]
     */
    public async getAllBlockList(userId: string): Promise<Block[]> {
        const user = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[블록 목록 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        return await this.model.getAllBlockList(userId);
    }

    /**
     * 블록 목록 조회
     * 
     * @param blockGroupId 블록 그룹 ID
     * @returns Block[]
     */
    public async getBlockList(blockGroupId: string): Promise<Block[]> {
        this.logger.log(`[블록 목록 조회] API 호출 [ blockGroupId : ${blockGroupId} ]`);

        const blockGroup: BlockGroup = new BlockGroup();
        blockGroup.id = blockGroupId;

        return await this.model.getBlockListByGroup(blockGroup);
    }

    /**
     * 블록 좋아요 생성
     * 
     * @param userId 사용자 ID
     * @param blockId 블록 ID
     * @returns 좋아요 정보
     */
    public async createLikes(userId: string, blockId: string): Promise<UserLikesBlock> {
        this.logger.log(`[블록 좋아요] API 호출 [ userId : ${userId} ]`);

        const user: User = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[블록 좋아요] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        const block: Block = await this.model.read(blockId);
        if (!block) {
            this.logger.log(`[블록 좋아요] 실패 [ blockId : ${blockId} ] -> 블록을 찾을 수 없음`);
            throw new BlockNotFoundError();
        }

        const isExisted: UserLikesBlock = await this.userLikesBlockModel.read(userId, blockId);
        if (isExisted) {
            this.logger.log(`[블록 좋아요] 실패 [ blockId : ${blockId} ] -> 이미 좋아요를 했습니다.`);
            throw new UserLikesBlockConflictError();
        }
    
        this.logger.log(`[블록 좋아요] 시작 [ blockId : ${blockId} ]`);
        const likes: UserLikesBlock = this.userLikesBlockModel.create(userId, blockId);
        this.logger.log(`[블록 좋아요] 성공 [ id : ${likes.id} ] `);

        return await this.userLikesBlockModel.save(likes);
    }

    /**
     * 블록 좋아요 취소
     * 
     * @param userId 사용자 ID
     * @param blockId 블록 ID
     * @returns 좋아요 정보
     */
    public async deleteLikes(userId: string, blockId: string): Promise<UserLikesBlock> {
        this.logger.log(`[블록 좋아요 취소] API 호출 [ userId : ${userId} ]`);

        const user: User = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[블록 좋아요 취소] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        const block: Block = await this.model.read(blockId);
        if (!block) {
            this.logger.log(`[블록 좋아요 취소] 실패 [ blockId : ${blockId} ] -> 블록을 찾을 수 없음`);
            throw new BlockNotFoundError();
        }

        const likes: UserLikesBlock = await this.userLikesBlockModel.read(userId, blockId);
        if (!likes) {
            this.logger.log(`[블록 좋아요 취소] 실패 [ blockId : ${blockId} ] -> 좋아요를 찾을 수 없습니다.`);
            throw new UserLikesBlockNotFoundError();
        }
    
        this.logger.log(`[블록 좋아요 취소] 시작 [ blockId : ${blockId} ]`);
        this.userLikesBlockModel.delete(likes.id);
        this.logger.log(`[블록 좋아요 취소] 성공 [ id : ${likes.id} ] `);

        return likes;
    }

    /**
     * 좋아요한 블록 목록 조회
     * 
     * @param userId 사용자 ID
     * @returns Block[]
     */
    public async getLikesBlockList(userId: string): Promise<Block[]> {
        this.logger.log(`[좋아요 블록 목록 조회] API 호출 [ userId : ${userId} ]`);

        const user: User = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[좋아요 블록 목록 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        const userLikesBlocks: UserLikesBlock[] = await this.userLikesBlockModel.getBlocksByUser(userId);
        const likedBlocks: Block[] = userLikesBlocks.map(ulb => ulb.block);

        return likedBlocks;
    }

    /**
     * 한 주 블록 갯수 조회
     * 
     * @param userId 사용자 ID
     * @returns any[]
     */
    public async getBlockCountsByWeek(userId: string, date: string): Promise<{ date: string, count: number }[]> {
        this.logger.log(`[한 주 블록 갯수 조회] API 호출 [ userId : ${userId} ]`);

        const user: User = await this.userModel.read(userId);
        if (!user) {
            this.logger.log(`[한 주 블록 갯수 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
            throw new UserNotFoundError();
        }

        const arrays = this.model.getBlockCountsByWeek(userId, date);

        return arrays;
    }
    
    /**
     * URL 크롤링 후 p 태그의 내용 반환
     * 
     * @param url 웹 URL
     * @returns 
     */
    private async getContentsByURL(url: string): Promise<{ title: string, subtitle: string, content: string }> {
        this.logger.log(`[크롤링] 시작 [ URL : ${url} ]`);
    
        let result = {
            title: "",
            subtitle: "",
            content: ""
        };
    
        await axios.get(url).then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            
            result.title = $('title').text();
            result.subtitle = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
            result.content = $('p').text();
        })
        .catch(error => {
            this.logger.error(`[크롤링] 오류 출력 [ error : ${error.message} ]`);
        });
    
        this.logger.log(`[크롤링] 성공`);
        return result;
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
                this.logger.log(`[GPT 호출] 실패`);
                return "";
            }
        } catch (error) {
            this.logger.log(`[GPT 호출] 오류 출력 [ error : ${error.message} ]`);
            return "";
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
