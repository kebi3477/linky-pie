import { Injectable } from '@nestjs/common';
import { Logger } from 'src/module/logger';
import { GroupRepository } from './group.repository';
import { UserRepository } from 'src/user/user.repository';
import { CreateGroupDTO } from './group.dto';
import { UserMessage } from 'src/user/user.message';
import { Group } from 'src/group/group.entity';
import { User } from 'src/user/user.entity';

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
     * @param createGroupDTO 그룹 생성 DTO
     * @returns 생성한 그룹
     */
    public async create(userId: string, createGroupDTO: CreateGroupDTO): Promise<Group> {
        try {
            this.logger.log(`[블록 그룹 생성] API 호출 [ userId : ${userId} ]`);

            const user = await this.userModel.getUser(userId);
            if (!user) {
                this.logger.log(`[블록 그룹 생성] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            createGroupDTO.user = user;
        
            this.logger.log(`[블록 그룹 생성] 생성 시작 [ title : ${createGroupDTO.title} ] `);
            const newBlockGroup: Group = this.model.createGroup(createGroupDTO);
            this.logger.log(`[블록 그룹 생성] 생성 성공 [ id : ${newBlockGroup.id} ] `);
            return await this.model.save(newBlockGroup);
        } catch (error) {
            this.logger.error(`[블록 그룹 생성] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 그룹 목록 조회
     * 
     * @param userId 사용자ID
     * @returns 그룹 목록
     */
    public async getGroupList(userId: string): Promise<Group[]> {
        try {
            this.logger.log(`[블록 목록 조회] API 호출 [ userId : ${userId} ]`);

            const user: User = new User();
            user.id = userId;

            return await this.model.getGroupListByUser(user);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}
