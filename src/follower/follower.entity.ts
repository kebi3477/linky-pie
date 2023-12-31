import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('followers')
export class Follower {
    @PrimaryGeneratedColumn({
        comment: '팔로잉 고유 아이디',
    })
    id: number;

    @ManyToOne(() => User, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'user_id'
    })
    user: User;

    @ManyToOne(() => User, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'follow_id' 
    })
    following: User;

    @CreateDateColumn({ 
        name: 'created_at', 
        type: 'timestamp', 
        nullable: true, 
        comment: '생성날짜' 
    })
    createdAt: Date;
}