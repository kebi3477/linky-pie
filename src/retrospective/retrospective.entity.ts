import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Block } from '../block/block.entity';

@Entity('retrospectives')
export class Retrospective {
    @PrimaryGeneratedColumn({ 
        comment: '회고 고유 아이디' 
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

    @Column('text', {
        comment: '회고 본문',
    })
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
