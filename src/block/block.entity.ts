import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BlockGroup } from '../block-group/block-group.entity';
import { User } from '../user/user.entity';
import { BlockComment } from '../block-comment/block-comment.entity';
import { BlockSeriesBlock } from 'src/block-series-block/block-series-block.entity';

@Entity('blocks')
export class Block {
    @PrimaryGeneratedColumn('uuid', { 
        comment: '블록(웹 링크) 고유 아이디' 
    })
    id: string;

    @Column({ 
        length: 100,
        comment: '블록 제목' 
    })
    title: string;

    @Column({
        type: 'text', 
        nullable: true, 
        comment: '블록 부제목' 
    })
    subtitle: string;

    @Column({
        type: 'text', 
        nullable: true, 
        comment: '블록 요약 본문' 
    })
    content: string;

    @Column({
        type: 'text', 
        nullable: true, 
        comment: '블록 해시태그' 
    })
    hashtag: string;

    @Column({
        type: 'text', 
        nullable: true, 
        comment: '블록 웹 URL 링크' 
    })
    link: string;

    @ManyToOne(() => BlockGroup, (group) => group.blocks, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'group_id'
    })
    blockGroup: BlockGroup;

    @ManyToOne(() => User, (user) => user.blocks, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'user_id' 
    })
    user: User;

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

    @OneToMany(() => BlockComment, (blockComment) => blockComment.block)
    blockComment: BlockComment[];

    @OneToMany(() => BlockSeriesBlock, bsb => bsb.block)
    blockSeriesConnection: BlockSeriesBlock[];

    @ManyToMany(() => User, user => user.likedBlocks)
    likedByUsers: User[];
}