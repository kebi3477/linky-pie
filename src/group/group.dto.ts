import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Group, GroupType } from 'src/group/group.entity';
import { User } from 'src/user/user.entity';

export class CreateGroupDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    type: GroupType

    user: User
}

export class UpdateGroupDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    type: GroupType
}

export class GroupResponseDto<T> {
    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsInt()
    @IsNotEmpty()
    statusCode: number;

    group: T;

    set(status:number, message: string, group: T = null): GroupResponseDto<T> {
        this.statusCode = status;
        this.message = message;
        this.group = group;
        return this;
    }
}