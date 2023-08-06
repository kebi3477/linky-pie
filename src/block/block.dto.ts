import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';
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

export class BlockResponseDto {
    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsInt()
    @IsNotEmpty()
    statusCode: number;

    block: Block|Block[];

    set(status:number, message: string, block: Block|Block[] = null): BlockResponseDto {
        this.statusCode = status;
        this.message = message;
        this.block = block;
        return this;
    }
}