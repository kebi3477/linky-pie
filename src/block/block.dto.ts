import { IsString, IsNotEmpty } from 'class-validator';
import { BlockGroup } from '../block-group/block-group.entity';
import { User } from '../user/user.entity';

export class CreateBlockDTO {
    @IsNotEmpty()
    @IsString()
    link: string;

    title: string;

    subtitle: string;

    content: string;

    hashtag: string;

    blockGroup?: BlockGroup|null;
    
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

    blockGroup?: BlockGroup|null;
}