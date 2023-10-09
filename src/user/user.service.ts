import multer from 'multer';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO, UpdateUserDescribeDTO, UpdateUserNameDTO } from './user.dto';
import { User } from './user.entity';
import { Logger } from '../module/logger';
import { FollowerRepository } from '../follower/follower.repository';
import { Follower } from '../follower/follower.entity';
import { UserConflictError, UserNotFoundError } from './user.error';
import { FollowerConflictError, FollowerNotFoundError } from 'src/follower/follower.error';

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
        this.logger.log(`[사용자 생성] API 호출 [ userId : ${createUserDTO.id} ]`);

        const existingUser: User = await this.model.read(createUserDTO.id);
        if (existingUser) {
            this.logger.log(`[사용자 생성] 생성 실패  [ userId : ${createUserDTO.id} ] -> 중복된 사용자 ID`);
            throw new UserConflictError();
        }
                    
        const newUser = this.model.create(createUserDTO);
        this.logger.log(`[사용자 생성] 생성 성공  [ userId : ${createUserDTO.id} ]`);

        return await this.model.save(newUser);
    }

    /**
     * 아이디로 사용자 조회
     * 
     * @param id 사용자ID
     * @returns 사용자 정보
     */
    public async getById(id: string): Promise<User> {
        this.logger.log(`[사용자 조회] API 호출 [ userId : ${id} ]`);

        const user = await this.model.read(id);
        if (!user) {
            this.logger.log(`[사용자 조회] 실패 [ userId : ${id} ] -> 존재하지 않는 사용자ID `);
            throw new UserNotFoundError();
        }

        user.followerCount = await this.followerModel.getFollowerCount(id);
        user.followingCount = await this.followerModel.getFollowingCount(id);
        
        return user;
    }

    /**
     * 사용자 전체 검색
     * 
     * @param search 검색할 아이디
     * @returns 사용자 목록
     */
    public async findAllUsers(userId: string, search?: string): Promise<User[]> {
        return this.model.findAllUsers(userId, search);
    }

    /**
     * 사용자 이름 수정
     * 
     * @param userId 수정할 아이디
     * @param updateUserNameDTO 이름 수정 DTO
     * @returns 사용자
     */
    public async updateName(userId: string, updateUserNameDTO: UpdateUserNameDTO): Promise<User> {
        this.logger.log(`[사용자 이름 수정] API 호출 [ userId : ${userId} ]`);

        const user: User = await this.model.read(userId);
        if (!user) {
            this.logger.log(`[사용자 이름 수정] 이름 수정 실패  [ userId : ${userId} ] -> 존재하지 않는 사용자`);
            throw new UserNotFoundError();
        }
                    
        user.name = updateUserNameDTO.name;
        await this.model.save(user);
        this.logger.log(`[사용자 이름 수정] 성공 [ userId : ${userId} ] `);
    
        return user;
    }

    /**
     * 사용자 프로필 이미지 수정
     * 
     * @param userId 수정할 아이디
     * @param file 프로필 이미지 파일
     * @returns 사용자
     */
    public async updateProfileImage(userId: string, file: Express.Multer.File): Promise<User> {
        this.logger.log(`[사용자 프로필 이미지 수정] API 호출 [ userId : ${userId} ]`);

        const user: User = await this.model.read(userId);
        if (!user) {
            this.logger.log(`[사용자 프로필 이미지 수정] 이미지 수정 실패  [ userId : ${userId} ] -> 존재하지 않는 사용자`);
            throw new UserNotFoundError();
        }

        user.image = process.env.PROJECT_URL + '/uploads/' + file.filename;
        await this.model.save(user);
        this.logger.log(`[사용자 프로필 이미지 수정] 성공 [ userId : ${userId} ] `);

        return user;
    }

    /**
     * 사용자 설명 수정
     * 
     * @param userId 수정할 아이디
     * @param updateUserNameDTO 설명 수정 DTO
     * @returns 사용자
     */
    public async updateDescribe(userId: string, updateUserDescribeDTO: UpdateUserDescribeDTO): Promise<User> {
        this.logger.log(`[사용자 설명 수정] API 호출 [ userId : ${userId} ]`);

        const user: User = await this.model.read(userId);
        if (!user) {
            this.logger.log(`[사용자 설명 수정] 이름 수정 실패  [ userId : ${userId} ] -> 존재하지 않는 사용자`);
            throw new UserNotFoundError();
        }
                    
        user.describe = updateUserDescribeDTO.describe;
        await this.model.save(user);
        this.logger.log(`[사용자 설명 수정] 성공 [ userId : ${userId} ] `);
    
        return user;
    }

    /**
     * 팔로잉
     * 
     * @param userId 팔로우 하는 사용자 아이디
     * @param followingUserId 팔로잉 받는 사용자 아이디
     * @returns 팔로우한 사용자 정보
     */
    async followUser(userId: string, followId: string): Promise<User> {
        this.logger.log(`[팔로잉] API 호출 [ userId : ${userId}, followId : ${followId} ]`);

        const follow: Follower = await this.followerModel.getFollower(userId, followId);
        if (follow) {
            this.logger.log(`[팔로잉] 실패 [ userId : ${userId} ] -> 이미 팔로우 중 입니다! `);
            throw new FollowerConflictError();
        }

        const user: User = await this.model.read(userId);
        if (!user) {
            this.logger.log(`[팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 사용자ID `);
            throw new UserNotFoundError();
        }

        const following: User = await this.model.read(followId);
        if (!following) {
            this.logger.log(`[팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 팔로잉 대상 ID `);
            throw new UserNotFoundError();
        }

        const follower = new Follower();
        follower.user = user;
        follower.following = following;

        await this.followerModel.save(follower);
        this.logger.log(`[팔로잉] 성공 [ userId : ${userId} ]`);

        return following;
    }

    /**
     * 언팔로우
     * 
     * @param userId 팔로우 한 사용자 아이디
     * @param followId 취소할 팔로잉 아이디
     * @returns 언팔로우한 사용자 정보
     */
    async unfollowUser(userId: string, followId: string): Promise<User> {
        this.logger.log(`[언팔로잉] API 호출 [ userId : ${userId}, followId : ${followId} ]`);

        const follow: Follower = await this.followerModel.getFollower(userId, followId);
        if (!follow) {
            this.logger.log(`[언팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 팔로우 `);
            throw new FollowerNotFoundError();
        }

        const user: User = await this.model.read(userId);
        if (!user) {
            this.logger.log(`[언팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 사용자ID `);
            throw new UserNotFoundError();
        }

        const following: User = await this.model.read(followId);
        if (!following) {
            this.logger.log(`[언팔로잉] 실패 [ userId : ${userId} ] -> 존재하지 않는 팔로잉 대상 ID `);
            throw new UserNotFoundError();
        }

        await this.followerModel.deleteFollower(user, following);
        this.logger.log(`[언팔로잉] 성공 [ userId : ${userId}, followId : ${followId} ]`);

        return following;
    }

    /**
     * 팔로워 목록 조회
     * 
     * @param userId 팔로워 조회 할 아이디
     * @returns 팔로워 목록
     */
    async getFollowers(userId: string): Promise<User[]> {
        const user: User = await this.model.read(userId);
        if (!user) {
            this.logger.log(`[팔로워 목록 조회] 실패 [ userId : ${userId} ] -> 존재하지 않는 사용자ID `);
            throw new UserNotFoundError();
        }

        return await this.followerModel.getFollowers(userId);
    }

    /**
     * 팔로잉 목록 조회
     * 
     * @param userId 팔로잉 하는 아이디
     * @returns 팔로잉 목록
     */
    async getFollowings(userId: string): Promise<User[]> {
        const user: User = await this.model.read(userId);
        if (!user) {
            this.logger.log(`[팔로잉 목록 조회] 실패 [ userId : ${userId} ] -> 존재하지 않는 사용자ID `);
            throw new UserNotFoundError();
        }

        return await this.followerModel.getFollowings(userId);
    }

    public getMulterConfig() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './uploads/'); // 이미지가 저장될 경로
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); 
            }
        });
    
        return { storage: storage };
    }
}
