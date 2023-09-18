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
        const subQuery = this.repository
                         .createQueryBuilder('follow')
                         .select('1', 'amIFollowing')
                         .where('follow.user_id = :userId')
                         .andWhere('follow.follow_id = user.id')
                         .getQuery();

        return await this.userRepository
               .createQueryBuilder('user')
               .addSelect(`(${subQuery})`, 'amIFollowing')
               .innerJoin('user.followers', 'follower', 'follower.follow_id = :userId')
               .where('follower.follow_id = :userId', { userId })
               .orderBy('user.id')
               .getRawMany();
    }

    public async getFollowings(userId: string): Promise<User[]> {
        const subQuery = this.repository
                         .createQueryBuilder('follow')
                         .select('1', 'amIFollowing')
                         .where('follow.user_id = :userId')
                         .andWhere('follow.follow_id = user.id')
                         .getQuery();

        return await this.userRepository
               .createQueryBuilder('user')
               .addSelect(`(${subQuery})`, 'amIFollowing')
               .innerJoin('user.following', 'following')
               .where('following.user_id = :userId', { userId })
               .getRawMany();
    }    

    public async getFollowerCount(userId: string): Promise<number> {
        return await this.repository.count({ where: { following: { id: userId } }})
    }
    
    public async getFollowingCount(userId: string): Promise<number> {
        return await this.repository.count({ where: { user: { id: userId } }})
    }
}