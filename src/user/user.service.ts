import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';
import { User } from 'src/entity/user.entity';
import { UserMessage } from './user.message';

@Injectable()
export class UserService {
    constructor(private readonly model: UserRepository) {}

    async create(createUserDTO: CreateUserDTO): Promise<User> {
        try {
            const existingUser = await this.model.getUser(createUserDTO.id);
            if (existingUser) {
                throw new Error(UserMessage.CONFLICT);
            }
            
            const newUser = this.model.createUser(createUserDTO);
            return await this.model.save(newUser);
        } catch (error) {
            throw error;
        }
    }

    async login(id: string, password: string): Promise<User> {
        try {
            const user = await this.model.login(id, password);
            if (!user) {
                throw new Error(UserMessage.NOT_FOUND);
            }
            
           return user;
        } catch (error) {
            throw error;
        }
    }
}
