import { IsNotEmpty, IsString } from "class-validator";
import { Block } from "../block/block.entity";
import { User } from "../user/user.entity";

export class CreateBlockCommentDTO {
    @IsNotEmpty()
    @IsString()
    content: string;
    
    block: Block;
    
    user: User;
}

export class UpdateBlockCommentDTO {
    @IsNotEmpty()
    @IsString()
    content: string;
}