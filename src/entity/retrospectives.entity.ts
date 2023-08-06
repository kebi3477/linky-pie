import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Block } from './block.entity';

@Entity('retrospectives')
export class Retrospective {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Block, (block) => block.retrospectives)
    @JoinColumn({ name: 'block_id' })
    block: Block;

    @Column({ length: 500 })
    title: string;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
