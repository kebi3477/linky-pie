import { IsString, IsNotEmpty } from 'class-validator';
import { User } from '../user/user.entity';

export class CreateBlockSeriesDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    user: User
}

export class UpdateBlockSeriesDTO {
    @IsString()
    @IsNotEmpty()
    title: string;
}