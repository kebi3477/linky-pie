import { Block } from '../block/block.entity';
import { User } from '../user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';

@Entity('block_comments')
export class BlockComment {
    @PrimaryGeneratedColumn({ 
        comment: '댓글 고유 아이디' 
    })
    id: number;

    @ManyToOne(() => Block, (block) => block.retrospectives, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'block_id' 
    })
    block: Block;

    @ManyToOne(() => User, (user) => user.blockComments, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'user_id' 
    })
    user: User;

    @Column({ type: 'text', comment: '댓글 내용' })
    content: string;

    @CreateDateColumn({ 
        name: 'created_at', 
        type: 'timestamp', 
        nullable: true, 
        comment: '생성날짜' 
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp', 
        nullable: true, 
        comment: '수정날짜' 
    })
    updatedAt: Date | null;
}
