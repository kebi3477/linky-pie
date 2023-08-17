import { Injectable } from '@nestjs/common';
import { Logger } from '../module/logger';
import { GroupRepository } from './block-group.repository';
import { UserRepository } from '../user/user.repository';
import { CreateBlockGroupDTO, UpdateBlockGroupDTO } from './block-group.dto';
import { UserMessage } from '../user/user.message';
import { BlockGroup } from './block-group.entity';
import { User } from '../user/user.entity';
import { GroupMessage } from './block-group.message';

@Injectable()
export class GroupService {
    private logger = new Logger(GroupService.name).getLogger();

    constructor(
        private readonly model: GroupRepository,
        private readonly userModel: UserRepository
    ) {}

    /**
     * 그룹 생성
     * 
     * @param userId 사용자ID
     * @param CreateBlockGroupDTO 그룹 생성 DTO
     * @returns 생성한 그룹
     */
    public async create(userId: string, CreateBlockGroupDTO: CreateBlockGroupDTO): Promise<BlockGroup> {
        try {
            this.logger.log(`[블록 그룹 생성] API 호출 [ userId : ${userId} ]`);

            const user: User = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 그룹 생성] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            CreateBlockGroupDTO.user = user;
        
            this.logger.log(`[블록 그룹 생성] 생성 시작 [ title : ${CreateBlockGroupDTO.title} ] `);
            const newBlockGroup: BlockGroup = this.model.create(CreateBlockGroupDTO);
            this.logger.log(`[블록 그룹 생성] 생성 성공 [ id : ${newBlockGroup.id} ] `);
            return await this.model.save(newBlockGroup);
        } catch (error) {
            this.logger.error(`[블록 그룹 생성] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 그룹 조회
     * 
     * @param userId 사용자ID
     * @param groupId 그룹ID
     * @returns 조회한 그룹
     */
    public async read(userId: string, groupId: string): Promise<BlockGroup> {
        try {
            this.logger.log(`[블록 그룹 조회] API 호출 [ userId : ${userId}, groupId : ${groupId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 그룹 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const group = await this.model.read(groupId);
            if (!group) {
                this.logger.log(`[블록 그룹 조회] 실패 [ groupId : ${groupId} ] -> 그룹을 찾을 수 없음`);
                throw new Error(GroupMessage.NOT_FOUND);
            }
        
            return group;
        } catch (error) {
            this.logger.error(`[블록 그룹 조회] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 그룹 수정
     * 
     * @param userId 사용자ID
     * @param groupId 그룹ID
     * @param UpdateBlockGroupDTO 그룹 수정 DTO
     * @returns 수정한 그룹
     */
    public async update(userId: string, groupId: string, UpdateBlockGroupDTO: UpdateBlockGroupDTO): Promise<BlockGroup> {
        try {
            this.logger.log(`[블록 그룹 수정] API 호출 [ userId : ${userId}, groupId : ${groupId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 그룹 수정] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const group = await this.model.read(groupId);
            if (!group) {
                this.logger.log(`[블록 그룹 수정] 실패 [ groupId : ${groupId} ] -> 그룹을 찾을 수 없음`);
                throw new Error(GroupMessage.NOT_FOUND);
            }

            Object.assign(group, UpdateBlockGroupDTO);
            await this.model.save(group);
            this.logger.log(`[블록 그룹 수정] 성공 [ groupId : ${groupId} ] `);
        
            return group;
        } catch (error) {
            this.logger.error(`[블록 그룹 수정] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 그룹 삭제
     * 
     * @param userId 사용자ID
     * @param groupId 그룹ID
     * @returns 삭제한 그룹
     */
    public async delete(userId: string, groupId: string): Promise<BlockGroup> {
        try {
            this.logger.log(`[블록 그룹 삭제] API 호출 [ userId : ${userId}, groupId : ${groupId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 그룹 삭제] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const group = await this.model.read(groupId);
            if (!group) {
                this.logger.log(`[블록 그룹 삭제] 실패 [ groupId : ${groupId} ] -> 그룹을 찾을 수 없음`);
                throw new Error(GroupMessage.NOT_FOUND);
            }

            await this.model.delete(groupId);
            this.logger.log(`[블록 그룹 삭제] 성공 [ groupId : ${groupId} ] `);
        
            return group;
        } catch (error) {
            this.logger.error(`[블록 그룹 삭제] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }
    
    /**
     * 그룹 목록 조회
     * 
     * @param userId 사용자ID
     * @returns 그룹 목록
     */
    public async getList(userId: string): Promise<BlockGroup[]> {
        try {
            this.logger.log(`[블록 목록 조회] API 호출 [ userId : ${userId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 목록 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            return await this.model.getGroupListByUserId(userId);
        } catch (error) {
            this.logger.error(`[블록 목록 조회] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

}
