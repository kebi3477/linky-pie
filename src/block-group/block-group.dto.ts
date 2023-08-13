import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { BlockGroupType } from './block-group.entity';
import { User } from '../user/user.entity';

export class CreateBlockGroupDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    type: BlockGroupType

    user: User
}

export class UpdateBlockGroupDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    type: BlockGroupType
}