import { Injectable } from '@nestjs/common';
import { RetrospectiveRepository } from './retrospective.repository';
import { Logger } from 'src/module/logger';
import { Retrospective } from './retrospective.entity';
import { CreateRetrospectiveDTO, UpdateRetrospectiveDTO } from './retrospective.dto';
import { UserRepository } from 'src/user/user.repository';
import { BlockRepository } from 'src/block/block.repository';
import { UserMessage } from 'src/user/user.message';
import { BlockMessage } from 'src/block/block.message';
import { User } from 'src/user/user.entity';
import { Block } from 'src/block/block.entity';
import { RetrospectiveMessage } from './retrospective.message';

@Injectable()
export class RetrospectiveService {
    private logger = new Logger(RetrospectiveService.name).getLogger();

    constructor(
        private readonly model: RetrospectiveRepository,
        private readonly userModel: UserRepository,
        private readonly blockModel: BlockRepository,
    ) {}

    /**
     * 회고 생성
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     * @param createRetrospectiveDTO 블록 생성 DTO
     * @returns 생성한 Block
     */
    public async create(userId: string, blockId: string, createRetrospectiveDTO: CreateRetrospectiveDTO): Promise<Retrospective> {
        try {
            this.logger.log(`[회고 생성] API 호출 [ userId : ${userId} ]`);

            const user: User = await this.userModel.getUser(userId);
            if (!user) {
                this.logger.log(`[회고 생성] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.blockModel.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[회고 생성] 실패 [ blockId : ${blockId}] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }

            createRetrospectiveDTO.block = block;
        
            const newRetrospective: Retrospective = this.model.createRetrospective(createRetrospectiveDTO);
            this.logger.log(`[회고 생성] 성공 [ id : ${newRetrospective.id} ] `);
            return await this.model.save(newRetrospective);
        } catch (error) {
            this.logger.error(`[회고 생성] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 회고 조회
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     * @returns 생성한 Block
     */
    public async read(userId: string, blockId: string, retrospectiveId: number): Promise<Retrospective> {
        try {
            this.logger.log(`[회고 조회] API 호출 [ userId : ${userId} ]`);

            const user: User = await this.userModel.getUser(userId);
            if (!user) {
                this.logger.log(`[회고 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.blockModel.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[회고 조회] 실패 [ blockId : ${blockId}] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }
        
            const retrospective: Retrospective = await this.model.getRetrospective(blockId, retrospectiveId);
            if (!retrospective) {
                this.logger.log(`[회고 수정] 실패 [ blockId : ${blockId}] -> 회고를 찾을 수 없음`);
                throw new Error(RetrospectiveMessage.NOT_FOUND);
            } 

            this.logger.log(`[회고 조회] 성공 [ id : ${retrospective.id} ] `);
            return retrospective;
        } catch (error) {
            this.logger.error(`[회고 조회] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 회고 수정
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     * @returns 생성한 Block
     */
    public async update(userId: string, blockId: string, retrospectiveId: number, updateRetrospectiveDTO: UpdateRetrospectiveDTO): Promise<Retrospective> {
        try {
            this.logger.log(`[회고 수정] API 호출 [ retrospectiveId : ${retrospectiveId}, userId : ${userId} ]`);

            const user: User = await this.userModel.getUser(userId);
            if (!user) {
                this.logger.log(`[회고 수정] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const block: Block = await this.blockModel.getBlockByUserId(blockId, userId);
            if (!block) {
                this.logger.log(`[회고 수정] 실패 [ blockId : ${blockId}] -> 블록을 찾을 수 없음`);
                throw new Error(BlockMessage.NOT_FOUND);
            }

            const retrospective: Retrospective = await this.model.getRetrospective(blockId, retrospectiveId);
            if (!retrospective) {
                this.logger.log(`[회고 수정] 실패 [ blockId : ${blockId}] -> 회고를 찾을 수 없음`);
                throw new Error(RetrospectiveMessage.NOT_FOUND);
            } 
            
            Object.assign(retrospective, updateRetrospectiveDTO);
            this.logger.log(`[회고 수정] 성공 [ id : ${retrospective.id} ] `);
            
            return await this.model.save(retrospective);
        } catch (error) {
            this.logger.error(`[회고 수정] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 회고 삭제
     * 
     * @param userId 사용자ID
     * @param blockId 블록ID
     * @returns 생성한 Block
     */
        public async delete(userId: string, blockId: string, retrospectiveId: number): Promise<Retrospective> {
            try {
                this.logger.log(`[회고 삭제] API 호출 [ retrospectiveId : ${retrospectiveId}, userId : ${userId} ]`);
    
                const user: User = await this.userModel.getUser(userId);
                if (!user) {
                    this.logger.log(`[회고 삭제] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                    throw new Error(UserMessage.NOT_FOUND);
                }
    
                const block: Block = await this.blockModel.getBlockByUserId(blockId, userId);
                if (!block) {
                    this.logger.log(`[회고 삭제] 실패 [ blockId : ${blockId}] -> 블록을 찾을 수 없음`);
                    throw new Error(BlockMessage.NOT_FOUND);
                }
    
                const retrospective: Retrospective = await this.model.getRetrospective(blockId, retrospectiveId);
                if (!retrospective) {
                    this.logger.log(`[회고 삭제] 실패 [ blockId : ${blockId}] -> 회고를 찾을 수 없음`);
                    throw new Error(RetrospectiveMessage.NOT_FOUND);
                } 
                
                await this.model.deleteRetrospective(retrospectiveId);
                this.logger.log(`[회고 삭제] 성공 [ id : ${retrospectiveId} ] `);
                
                return retrospective;
            } catch (error) {
                this.logger.error(`[회고 삭제] 에러! [ error : ${error.message} ] `);
                throw error;
            }
        }
}