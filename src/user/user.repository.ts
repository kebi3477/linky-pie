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

    public async save(user: User): Promise<User> {
        return await this.repository.save(user);
    }

    async findAllUsers(loggedInUserId: string, searchId?: string): Promise<User[]> {
        const query = this.repository
            .createQueryBuilder('user')
            .addSelect(subQuery => {
                return subQuery
                    .select('CASE WHEN follow.user_id IS NOT NULL THEN 1 ELSE 0 END', 'amIFollowing')
                    .from('followers', 'follow')
                    .where('follow.user_id = :loggedInUserId')
                    .andWhere('follow.follow_id = user.id')
                    .limit(1);
            }, 'amIFollowing')
            .where('user.id != :loggedInUserId', { loggedInUserId })
            .setParameter('loggedInUserId', loggedInUserId);

        if (searchId) {
            query.andWhere('user.id LIKE :searchId', { searchId: `%${searchId}%` });
        }

        return query.getRawMany();
    }
}