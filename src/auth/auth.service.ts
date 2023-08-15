import { Injectable } from '@nestjs/common';
import { Logger } from '../module/logger';
import { GoogleRequest, KakaoRequest, NaverRequest, TokenPayload } from './auth.interface';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Provider, User, UserType } from '../user/user.entity';
import { UserMessage } from '../user/user.message';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/user/user.dto';

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name).getLogger();

    constructor(
        private readonly userModel: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    
    /**
     * 로그인
     * 
     * @param id 사용자ID
     * @param password 사용자 PW
     * @returns 로그인 사용자 정보
     */
    public async login(id: string, password: string): Promise<User> {
        try {
            this.logger.log(`[로그인] API 호출 [ userId : ${id} ]`);

            const user = await this.userModel.read(id);
            if (!user) {
                this.logger.log(`[로그인] 실패 [ userId : ${id} ] -> 존재하지 않는 사용자ID `);
                throw new Error(UserMessage.NOT_FOUND);
            }
    
            const isMatch: boolean = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                this.logger.log(`[로그인] 실패 [ userId : ${id} ] -> 잘못된 비밀번호`);
                throw new Error(UserMessage.NOT_FOUND);
            }
            
            this.logger.log(`[로그인] 성공 [ userId : ${id} ]`);
            return user;
        } catch (error) {
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
    
                const user = await this.userModel.read(id);
                if (!user) {
                    this.logger.log(`[사용자 조회] 실패 [ userId : ${id} ] -> 존재하지 않는 사용자ID `);
                    throw new Error(UserMessage.NOT_FOUND);
                }
                
                return user;
            } catch (error) {
                throw error;
            }
        }

    /**
     * 로그인 쿠키 생성
     * 
     * @param id 사용자ID
     * @returns 쿠키 정보
     */
    public getCookieWithJwtToken(id: string): string {
        this.logger.log(`[쿠키 생성] API 호출 [ userId : ${id} ]`);

        const payload: TokenPayload = { id : id }
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    /**
     * 로그아웃 쿠키 삭제
     * 
     * @returns 쿠키 정보
     */
    public getCookieForLogOut(): string {
        this.logger.log(`[로그아웃] API 호출`);

        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    /**
     * 카카오 로그인
     * 
     * @param req 카카오 요청 값
     * @returns 
     */
    async kakaoLogin(req: KakaoRequest): Promise<string> {
        try {
            this.logger.log(`[카카오 로그인] API 호출`);

            const { user: { email, name } } = req;
    
            const findUser: User = await this.userModel.read(email);
            if (findUser) {
                this.logger.log(`[카카오 로그인] 이미 존재하는 이메일`);
                return this.getCookieWithJwtToken(findUser.id);
            }
    
            const createUserDTO: CreateUserDTO = new CreateUserDTO();
            createUserDTO.id = email;
            createUserDTO.name = name;
            createUserDTO.password = '';
            createUserDTO.type = UserType.User;
            createUserDTO.provider = Provider.Kakao;
    
            this.logger.log(`[카카오 로그인] 사용자 생성  [ userId : ${createUserDTO.id} ]`);
            const user: User = this.userModel.create(createUserDTO); 
            await this.userModel.save(user); 
    
            return this.getCookieWithJwtToken(email);  
        } catch (error) {
            this.logger.error(`[카카오 로그인] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 구글 로그인
     * 
     * @param req 구글 요청 값
     * @returns 
     */
    async googleLogin(req: GoogleRequest): Promise<string> {
        try {
            this.logger.log(`[구글 로그인] API 호출`);

            const { user: { email, name } } = req;
    
            const findUser: User = await this.userModel.read(email);
            if (findUser) {
                this.logger.log(`[구글 로그인] 이미 존재하는 이메일`);
                return this.getCookieWithJwtToken(findUser.id);
            }
    
            const createUserDTO: CreateUserDTO = new CreateUserDTO();
            createUserDTO.id = email;
            createUserDTO.name = `${name}`;
            createUserDTO.password = '';
            createUserDTO.type = UserType.User;
            createUserDTO.provider = Provider.Google;
    
            this.logger.log(`[구글 로그인] 사용자 생성  [ userId : ${createUserDTO.id} ]`);
            const user: User = this.userModel.create(createUserDTO); 
            await this.userModel.save(user); 
    
            return this.getCookieWithJwtToken(email);  
        } catch (error) {
            this.logger.error(`[구글 로그인] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 네이버 로그인
     * 
     * @param req 네이버 요청 값
     * @returns 
     */
    async naverLogin(req: NaverRequest): Promise<string> {
        try {
            this.logger.log(`[네이버 로그인] API 호출`);

            const { user: { email, name } } = req;
    
            const findUser: User = await this.userModel.read(email);
            if (findUser) {
                this.logger.log(`[네이버 로그인] 이미 존재하는 이메일`);
                return this.getCookieWithJwtToken(findUser.id);
            }
    
            const createUserDTO: CreateUserDTO = new CreateUserDTO();
            createUserDTO.id = email;
            createUserDTO.name = `${name}`;
            createUserDTO.password = '';
            createUserDTO.type = UserType.User;
            createUserDTO.provider = Provider.Naver;
    
            this.logger.log(`[네이버 로그인] 사용자 생성  [ userId : ${createUserDTO.id} ]`);
            const user: User = this.userModel.create(createUserDTO); 
            await this.userModel.save(user); 
    
            return this.getCookieWithJwtToken(email);  
        } catch (error) {
            this.logger.error(`[네이버 로그인] 오류! => ${error.message}`);
            throw error;
        }
    }
}
