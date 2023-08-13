import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { GroupType } from '../group/group.entity';
import { User } from '../user/user.entity';

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