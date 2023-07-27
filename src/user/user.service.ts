import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';
import { TokenPayload } from 'src/auth/auth.interface';
import { User } from 'src/entity/user.entity';
import { UserMessage } from './user.message';

@Injectable()
export class UserService {
    readonly salt: number = 10;

    constructor(
        private readonly model: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    public async create(createUserDTO: CreateUserDTO): Promise<User> {
        try {
            const existingUser: User = await this.model.getUser(createUserDTO.id);
            if (existingUser) {
                throw new Error(UserMessage.CONFLICT);
            }
            
            createUserDTO.password = await bcrypt.hash(createUserDTO.password, this.salt);
            const newUser = this.model.createUser(createUserDTO);
            return await this.model.save(newUser);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async login(id: string, password: string): Promise<User> {
        try {
            const user = await this.model.getUser(id);
            if (!user) {
                throw new Error(UserMessage.NOT_FOUND);
            }
    
            const isMatch: boolean = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error(UserMessage.NOT_FOUND);
            }
            
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async getById(id: string): Promise<User> {
        try {
            const user = await this.model.getUser(id);
            if (!user) {
                throw new Error(UserMessage.NOT_FOUND);
            }
            
            return user;
        } catch (error) {
            throw error;
        }
    }

    public getCookieWithJwtToken(id: string) {
        const payload: TokenPayload = { id : id }
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getCookieForLogOut(): string {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
}
