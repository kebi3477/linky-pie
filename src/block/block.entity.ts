import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Group } from '../group/group.entity';
import { User } from '../user/user.entity';
import { Retrospective } from '../retrospective/retrospective.entity';

@Entity('blocks')
export class Block {
    constructor(id: string = '') {
        this.id = id;
    }

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

    @ManyToOne(() => Group, (group) => group.blocks)
    @JoinColumn({ 
        name: 'group_id'
    })
    group: Group;

    @ManyToOne(() => User, (user) => user.blocks)
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

    @OneToMany(() => Retrospective, (retrospective) => retrospective.block)
    retrospectives: Retrospective[];
}