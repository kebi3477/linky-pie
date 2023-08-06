import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Group } from '../group/group.entity';
import { Block } from '../block/block.entity';
import { Follower } from '../follower/follower.entity';

export enum UserType {
    User = 0,
    Manager = 1
}

@Entity('users')
export class User {
    constructor(id:string = '') {
        this.id = id;
    }

    @PrimaryColumn({ 
        name: 'id', 
        length: 50, 
        comment: '아이디' 
    })
    id: string;
    
    @Column({ 
        name: 'password', 
        nullable: false, 
        length: 300, 
        comment: '비밀번호' 
    })
    password: string;
    
    @Column({ 
        name: 'name', 
        nullable: false, 
        length: 20, 
        comment: '닉네임' 
    })
    name!: string;

    @Column({ 
        name: 'type', 
        enum: UserType,
        default: UserType.User,
        comment: '0:사용자, 1:관리자' 
    })
    type: number;

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
    
    @DeleteDateColumn({ 
        name: 'deleted_at',
        type: 'timestamp', 
        nullable: true, 
        comment: '삭제날짜' 
    })
    deletedAt: Date | null;

    @OneToMany(() => Group, (group) => group.user)
    groups: Group[]

    @OneToMany(() => Block, (block) => block.user)
    blocks: Block[]

    @OneToMany(() => Follower, (follower) => follower.user)
    followers: Follower[];

    @OneToMany(() => Follower, (follower) => follower.following)
    following: Follower[];

    static of(params: Partial<User>): User {
        const user = new User();
        Object.assign(user, params);
        return user;
    }
}