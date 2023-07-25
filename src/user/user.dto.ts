import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';
import { User } from 'src/entity/user.entity';

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

    user: User

    setMessage(message: string): UserResponseDto {
        this.message = message;
        return this;
    }

    setUser(user: User): UserResponseDto {
        this.user = user;
        return this;
    }
}