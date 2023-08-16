import { Injectable } from '@nestjs/common';
import { Logger } from '../module/logger';
import { SocialRequest, TokenPayload } from './auth.interface';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Provider, User, UserType } from '../user/user.entity';
import { UserMessage } from '../user/user.message';
import { CreateUserDTO } from '../user/user.dto';

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name).getLogger();

    constructor(
        private readonly userModel: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

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
    async kakaoLogin(req: SocialRequest): Promise<string> {
        try {
            this.logger.log(`[카카오 로그인] API 호출`);

            const { user: { email, name, image } } = req;
    
            const findUser: User = await this.userModel.read(email);
            if (findUser) {
                this.logger.log(`[카카오 로그인] 이미 존재하는 이메일`);
                return this.getCookieWithJwtToken(findUser.id);
            }
    
            const isCreated: boolean = await this.createUser(email, name, image, Provider.Kakao);
            if (isCreated) {
                this.logger.log(`[카카오 로그인] 가입 성공! 로그인 요청`);
                return this.getCookieWithJwtToken(email);  
            }

            this.logger.log(`[카카오 로그인] 가입 실패!`);
            return "";
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
    async googleLogin(req: SocialRequest): Promise<string> {
        try {
            this.logger.log(`[구글 로그인] API 호출`);

            const { user: { email, name, image } } = req;
    
            const findUser: User = await this.userModel.read(email);
            if (findUser) {
                this.logger.log(`[구글 로그인] 로그인 요청`);
                return this.getCookieWithJwtToken(findUser.id);
            }
    
            const isCreated: boolean = await this.createUser(email, name, image, Provider.Google);
            if (isCreated) {
                this.logger.log(`[구글 로그인] 가입 성공! 로그인 요청`);
                return this.getCookieWithJwtToken(email);  
            }

            this.logger.log(`[구글 로그인] 가입 실패!`);
            return "";
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
    async naverLogin(req: SocialRequest): Promise<string> {
        try {
            this.logger.log(`[네이버 로그인] API 호출`);

            const { user: { email, name, image } } = req;
    
            const findUser: User = await this.userModel.read(email);
            if (findUser) {
                this.logger.log(`[네이버 로그인] 이미 존재하는 이메일`);
                return this.getCookieWithJwtToken(findUser.id);
            }
    
            const isCreated: boolean = await this.createUser(email, name, image, Provider.Naver);
            if (isCreated) {
                this.logger.log(`[네이버 로그인] 가입 성공! 로그인 요청`);
                return this.getCookieWithJwtToken(email);  
            }
    
            return this.getCookieWithJwtToken(email);  
        } catch (error) {
            this.logger.error(`[네이버 로그인] 오류! => ${error.message}`);
            throw error;
        }
    }

    /**
     * 소셜 가입 (사용자 생성)
     * 
     * @param email 사용자 아이디 
     * @param name 사용자 이름
     * @param image 사용자 이미지
     * @param provider 사용자 가입 경로
     * @returns 
     */
    async createUser(email: string, name: string, image: string, provider: Provider): Promise<boolean> {
        try {
            this.logger.log(`[소셜 가입] API 호출`);

            const createUserDTO: CreateUserDTO = new CreateUserDTO();
            createUserDTO.id = email;
            createUserDTO.name = name;
            createUserDTO.image = image;
            createUserDTO.type = UserType.User;
            createUserDTO.provider = provider;

            this.logger.log(`[소셜 가입] 사용자 생성 [ userId : ${email} ]`);
            const user: User = this.userModel.create(createUserDTO); 
            const newUser: User = await this.userModel.save(user); 

            if (newUser) {
                this.logger.log(`[소셜 가입] 성공 [ userId : ${email} ]`);
                return true;
            } else {
                this.logger.log(`[소셜 가입] 실패 [ userId : ${email} ]`);
                return false;
            }
        } catch (error) {
            this.logger.error(`[소셜 가입] 오류! => ${error.message}`);
            return false;
        }
    }
}
