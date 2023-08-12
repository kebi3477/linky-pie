import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Block } from 'src/block/block.entity';

@Entity()
export class UserLikesBlock {
    @PrimaryGeneratedColumn({ comment: '좋아요 고유 아이디' })
    id: number;

    @ManyToOne(() => User, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'user_id' 
    })
    user: User;
 
    @ManyToOne(() => Block, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'block_id' 
    })
    block: Block;
 
    @CreateDateColumn({ 
        name: 'created_at',
        type: 'timestamp', 
        nullable: true, 
        comment: '생성날짜' 
    })
    createdAt: Date;
}