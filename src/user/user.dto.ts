import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Provider, User, UserType } from '../user/user.entity';

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    id: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    name: string;

    @IsString()
    @MaxLength(100)
    image: string;
  
    type?: UserType;

    provider?: Provider;
}