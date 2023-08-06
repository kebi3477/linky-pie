import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';
import { User } from 'src/user/user.entity';

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

export class UserResponseDto {
    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsInt()
    @IsNotEmpty()
    statusCode: number;

    user: User;

    set(status:number, message: string, user: User = null): UserResponseDto {
        this.statusCode = status;
        this.message = message;
        this.user = user;
        return this;
    }
}