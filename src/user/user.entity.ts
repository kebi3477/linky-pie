import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BlockGroup } from '../block-group/block-group.entity';
import { Block } from '../block/block.entity';
import { Follower } from '../follower/follower.entity';
import { BlockComment } from '../block-comment/block-comment.entity';
import { Exclude } from 'class-transformer';

export enum UserType {
    User,
    Manager,
}

export enum Provider {
    Local,
    Google,
    Kakao,
}

@Entity('users')
export class User {
    @PrimaryColumn({ 
        name: 'id', 
        length: 50, 
        comment: '아이디' 
    })
    id: string;
    
    @Exclude()
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
        comment: '사용자 분류' 
    })
    type: UserType;

    @Column({ 
        name: 'provider',
        enum: Provider, 
        default: Provider.Local,
        comment: '로그인 출처'  
    })
    provider: Provider;

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
    
    @OneToMany(() => Block, (block) => block.user)
    blocks: Block[]

    @OneToMany(() => BlockGroup, (blockGroup) => blockGroup.user)
    blockGroups: BlockGroup[]

    @OneToMany(() => BlockComment, (block) => block.user)
    blockComments: BlockComment[]

    @OneToMany(() => Follower, (follower) => follower.user)
    followers: Follower[];

    @OneToMany(() => Follower, (follower) => follower.following)
    following: Follower[];

    @ManyToMany(() => Block, block => block.likedByUsers)
    @JoinTable()
    likedBlocks: Block[];

    static of(params: Partial<User>): User {
        const user = new User();
        Object.assign(user, params);
        return user;
    }
}