import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Follower } from '../follower/follower.entity';

@Injectable()
export class FollowerRepository {
    public constructor(
        @InjectRepository(Follower)
        private readonly repository: Repository<Follower>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    public async getFollower(userId: string, followId: string): Promise<Follower> {
        return await this.repository.findOne({ where: { user: { id : userId }, following: { id : followId } } })
    }

    public async deleteFollower(user: User, following: User): Promise<void> {
        await this.repository.delete({ user, following });
    }

    public async save(follower: Follower) {
        return await this.repository.save(follower);
    }

    public async getFollowers(userId: string): Promise<User[]> {
        return await this.userRepository
               .createQueryBuilder('user')
               .innerJoin('user.followers', 'follower')
               .where('follower.follow_id = :userId', { userId })
               .getMany();
    }

    public async getFollowing(userId: string): Promise<User[]> {
        return await this.userRepository
               .createQueryBuilder('user')
               .innerJoin('user.following', 'following')
               .where('following.user_id = :userId', { userId })
               .getMany();
    }
}