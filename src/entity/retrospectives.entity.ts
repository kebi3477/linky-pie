import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Block } from './block.entity';

@Entity('retrospectives')
export class Retrospective {
    @PrimaryGeneratedColumn({ comment: '회고 고유 아이디' })
    id: number;

    @ManyToOne(() => Block, (block) => block.retrospectives)
    @JoinColumn({ 
        name: 'block_id' 
    })
    block: Block;

    @Column({ 
        length: 500,
        comment: '회고 제목',
    })
    title: string;

    @Column('text', {
        comment: '회고 본문',
    })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
