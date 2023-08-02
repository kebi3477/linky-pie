import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';
import { User } from 'src/entity/user.entity';
import { UserMessage } from './user.message';
import { Logger } from 'src/module/logger';
import { FollowerRepository } from 'src/follower/follower.repository';
import { Follower } from 'src/entity/follower.entity';

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

            const existingUser: User = await this.model.getUser(createUserDTO.id);
            if (existingUser) {
                this.logger.log(`[사용자 생성] 생성 실패  [ userId : ${createUserDTO.id} ] -> 중복된 사용자 ID`);
                throw new Error(UserMessage.CONFLICT);
            }
            
            createUserDTO.password = await bcrypt.hash(createUserDTO.password, this.salt);
            const newUser = this.model.createUser(createUserDTO);
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

            const user = await this.model.getUser(id);
            if (!user) {
                this.logger.log(`[사용자 조회] 실패 [ userId : ${id} ] -> 존재하지 않는 사용자ID `);
                throw new Error(UserMessage.NOT_FOUND);
            }
            
            return user;
        } catch (error) {
            this.logger.error(`[사용자 조회] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 팔로잉
     * 
     * @param userId 팔로우 하는 사용자 아이디
     * @param followingUserId 팔로잉 받는 사용자 아이디
     */
    async followUser(userId: string, followingUserId: string): Promise<void> {
        try {
            this.logger.log(`[팔로잉] API 호출 [ userId : ${userId}, following : ${followingUserId} ]`);

            const user = new User(userId);
            const following = new User(followingUserId);
            const follower = new Follower();

            follower.user = user;
            follower.following = following;

            this.logger.log(`[팔로잉] 성공 [ userId : ${userId} ]`);
            await this.followerModel.save(follower);
        } catch (error) {
            this.logger.error(`[팔로잉] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 언팔로우
     * 
     * @param userId 팔로우 한 사용자 아이디
     * @param followingUserId 취소할 팔로잉 아이디
     */
    async unfollowUser(userId: string, followingUserId: string): Promise<void> {
        this.logger.log(`[언팔로우] API 호출 [ userId : ${userId}, following : ${followingUserId} ]`);

        const user = new User(userId);
        const following = new User(followingUserId);

        await this.followerModel.deleteFollower(user, following);
    }

    async getFollowers(userId: string): Promise<User[]> {
        return this.followerModel.getFollowers(userId);
    }

    async getFollowing(userId: string): Promise<User[]> {
        return this.followerModel.getFollowing(userId);
    }
}
