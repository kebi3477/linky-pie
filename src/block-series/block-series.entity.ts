import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Block } from '../block/block.entity';

@Entity('block_series')
export class BlockSeries {
    @PrimaryGeneratedColumn('uuid', {
        comment: '시리즈 고유 아이디',
    })
    id: string;
  
    @ManyToOne(() => User, (user) => user.blockGroups, { 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ 
        name: 'user_id'
    })
    user: User;
  
    @Column({ 
        length: 100,
        comment: '시리즈 제목',
     })
    title: string;

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
  