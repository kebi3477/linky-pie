import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';
import { User } from '../user/user.entity';

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    id: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    password: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    name: string;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    type?: number;
}