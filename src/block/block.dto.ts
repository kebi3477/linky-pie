import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max, IsEmpty } from 'class-validator';
import { Block } from 'src/block/block.entity';
import { Group } from 'src/group/group.entity';
import { User } from 'src/user/user.entity';

export class CreateBlockDTO {
    @IsNotEmpty()
    @IsString()
    link: string;

    title: string;

    subtitle: string;

    content: string;

    hashtag: string;

    group?: Group|null;
    
    user: User;
}

export class UpdateBlockDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    subtitle: string;

    content: string;

    hashtag: string;

    group?: Group|null;
}

export class BlockResponseDto<T> {
    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsInt()
    @IsNotEmpty()
    statusCode: number;

    block: T;

    set(status:number, message: string, block: T = null): BlockResponseDto<T> {
        this.statusCode = status;
        this.message = message;
        this.block = block;
        return this;
    }
}