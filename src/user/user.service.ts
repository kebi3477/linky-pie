import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';
import { Provider, User } from './user.entity';
import { UserMessage } from './user.message';
import { Logger } from '../module/logger';
import { FollowerRepository } from '../follower/follower.repository';
import { Follower } from '../follower/follower.entity';
import { FollowerMessage } from '../follower/follower.message';

@Injectable()
export class UserService {
    private logger = new Logger(UserService.name).getLogger();
    readonly salt: number = 10;

    constructor(
        private readonly model: UserRepository,
        private readonly followerModel: FollowerRepository
    ) {}

    /**
     * 회원가입
     * 
     * @param createUserDTO 사용자 생성 DTO
     * @returns 생성한 사용자
     */
    public async create(createUserDTO: CreateUserDTO): Promise<User> {
        try {
            this.logger.log(`[사용자 생성] API 호출 [ userId : ${createUserDTO.id} ]`);

            const existingUser: User = await this.model.read(createUserDTO.id);
            if (existingUser) {
                this.logger.log(`[사용자 생성] 생성 실패  [ userId : ${createUserDTO.id} ] -> 중복된 사용자 ID`);
                throw new Error(UserMessage.CONFLICT);
            }
                        
            const newUser = this.model.create(createUserDTO);
            this.logger.log(`[사용자 생성] 생성 성공  [ userId : ${createUserDTO.id} ]`);

            return await this.model.save(newUser);
        } catch (error) {
            this.logger.error(`[사용자 생성] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 아이디로 사용자 조회
     * 
     * @param id 사용자ID
     * @returns 사용자 정보
     */
    public async getById(id: string): Promise<User> {
        try {
            this.logger.log(`[사용자 조회] API 호출 [ userId : ${id} ]`);

            const user = await this.model.read(id);
            if (!user) {
                this.logger.log(`[사용자 조회] 실패 [ userId : ${id} ] -> 존재하지 않는 사용자ID `);
                throw new Error(UserMessage.NOT_FOUND);
            }

            user.followerCount = await this.followerModel.getFollowerCount(id);
            user.followingCount = await this.followerModel.getFollowingCount(id);
            
            return user;
        } catch (error) {
            this.logger.error(`[사용자 조회] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 사용자 전체 검색
     * 
     * @param searchId 검색할 아이디
     * @returns 사용자 목록
     */
    public async findAllUsers(userId: string, searchId?: string): Promise<User[]> {
        return this.model.findAllUsers(userId, searchId);
    }

    /**
     * 팔로잉
     * 
     * @param userId 팔로우 하는 사용자 아이디
     * @param followingUserId 팔로잉 받는 사용자 아이디
     * @returns 팔로우한 사용자 정보
     */
    async followUser(userId: string, followId: string): Promise<User> {
        try {
            this.logger.log(`[팔로잉] API 호출 [ userId : ${userId}, followId : ${followId} ]`);

            const follow: Follower = await this.followerModel.getFollower(userId, followId);
            if (follow) {
                this.logger.log(`[팔로잉] 실패 [ userId : ${userId} ] -> 이미 팔로우 중 입니다! `);
                throw new Error(FollowerMessage.CONFLICT);
            }

            const user: User = await this.model.read(userId);
            if (!user) {
                this.logger.log(`[팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 사용자ID `);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const following: User = await this.model.read(followId);
            if (!following) {
                this.logger.log(`[팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 팔로잉 대상 ID `);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const follower = new Follower();
            follower.user = user;
            follower.following = following;

            await this.followerModel.save(follower);
            this.logger.log(`[팔로잉] 성공 [ userId : ${userId} ]`);

            return following;
        } catch (error) {
            this.logger.error(`[팔로잉] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 언팔로우
     * 
     * @param userId 팔로우 한 사용자 아이디
     * @param followId 취소할 팔로잉 아이디
     * @returns 언팔로우한 사용자 정보
     */
    async unfollowUser(userId: string, followId: string): Promise<User> {
        try {
            this.logger.log(`[언팔로잉] API 호출 [ userId : ${userId}, followId : ${followId} ]`);
    
            const follow: Follower = await this.followerModel.getFollower(userId, followId);
            if (!follow) {
                this.logger.log(`[언팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 팔로우 `);
                throw new Error(FollowerMessage.NOT_FOUND);
            }
    
            const user: User = await this.model.read(userId);
            if (!user) {
                this.logger.log(`[언팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 사용자ID `);
                throw new Error(UserMessage.NOT_FOUND);
            }
    
            const following: User = await this.model.read(followId);
            if (!following) {
                this.logger.log(`[언팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 팔로잉 대상 ID `);
                throw new Error(UserMessage.NOT_FOUND);
            }
    
            await this.followerModel.deleteFollower(user, following);
            this.logger.log(`[언팔로잉] 성공 [ userId : ${userId}, followId : ${followId} ]`);

            return following;
        } catch (error) {
            this.logger.error(`[언팔로잉] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 팔로워 목록 조회
     * 
     * @param userId 팔로워 조회 할 아이디
     * @returns 팔로워 목록
     */
    async getFollowers(userId: string): Promise<User[]> {
        try {
            const user: User = await this.model.read(userId);
            if (!user) {
                this.logger.log(`[팔로워 목록 조회] 실패 [ userId : ${userId} ] -> 존재하지 않는 사용자ID `);
                throw new Error(UserMessage.NOT_FOUND);
            }

            return await this.followerModel.getFollowers(userId);
        } catch (error) {
            this.logger.error(`[팔로워 목록 조회] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 팔로잉 목록 조회
     * 
     * @param userId 팔로잉 하는 아이디
     * @returns 팔로잉 목록
     */
    async getFollowings(userId: string): Promise<User[]> {
        try {
            const user: User = await this.model.read(userId);
            if (!user) {
                this.logger.log(`[팔로잉 목록 조회] 실패 [ userId : ${userId} ] -> 존재하지 않는 사용자ID `);
                throw new Error(UserMessage.NOT_FOUND);
            }

            return await this.followerModel.getFollowings(userId);
        } catch (error) {
            this.logger.error(`[팔로잉 목록 조회] 오류! => ${error.message}`);
            throw error;
        }
    }
}
