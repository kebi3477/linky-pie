import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserFollow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user_id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'follow_id' })
    follow_id: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true, comment: '생성날짜' })
    createdAt: Date;
}