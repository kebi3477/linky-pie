import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Block } from 'src/entity/block.entity';

export class CreateBlockDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    title: string;
  
    @IsNotEmpty()
    @IsString()
    content: string;
  
    @IsNotEmpty()
    @IsString()
    link: string;

    user_id: string;
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