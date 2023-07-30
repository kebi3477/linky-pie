import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';
import { User } from 'src/entity/user.entity';
import { UserMessage } from './user.message';
import { Logger } from 'src/module/logger';

@Injectable()
export class UserService {
    private logger = new Logger(UserService.name).getLogger();
    readonly salt: number = 10;

    constructor(
        private readonly model: UserRepository,
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
            console.log(error);
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
            throw error;
        }
    }
}
