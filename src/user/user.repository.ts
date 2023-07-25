import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) {}

    public createUser(user: CreateUserDTO): User {
        return this.repository.create(user);
    }
    
    public async getUser(id: string): Promise<User> {
        return this.repository.findOne({ where: { id: id } });
    }

    public async deleteUser(id: string): Promise<void> {
        await this.repository.delete({id : id});
    }

    public async save(user: User) {
        return await this.repository.save(user);
    }
}