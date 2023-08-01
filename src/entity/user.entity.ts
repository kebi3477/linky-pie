import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { Block } from './block.entity';

@Entity('users')
export class User {
    @PrimaryColumn({ name: 'id', length: 50, comment: '아이디' })
    id: string;
    
    @Column({ name: 'password', nullable: false, length: 300, comment: '비밀번호' })
    password: string;
    
    @Column({ name: 'name', nullable: false, length: 20, comment: '닉네임' })
    name!: string;

    @Column({ name: 'type', default: 0, comment: '0:사용자, 1:관리자' })
    type: number;

    @OneToMany(() => Group, (group) => group.user)
    groups: Group[]

    @OneToMany(() => Block, (block) => block.user)
    blocks: Block[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true, comment: '생성날짜' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true, comment: '수정날짜' })
    updatedAt: Date | null;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true, comment: '삭제날짜' })
    deletedAt: Date | null;

    static of(params: Partial<User>): User {
        const user = new User();
        Object.assign(user, params);
        return user;
    }
}