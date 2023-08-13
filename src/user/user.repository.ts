import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserRepository {
    public constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) {}

    public create(createUserDTO: CreateUserDTO): User {
        return this.repository.create(createUserDTO);
    }
    
    public async read(id: string): Promise<User> {
        return this.repository.findOne({ where: { id } });
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete({ id });
    }

    public async save(user: User) {
        return await this.repository.save(user);
    }
}