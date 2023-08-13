import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Block } from "../block/block.entity";
import { Retrospective } from "./retrospective.entity";

export class CreateRetrospectiveDTO {
    @IsNotEmpty()
    content: string;
    
    block: Block
}

export class UpdateRetrospectiveDTO {
    @IsNotEmpty()
    content: string;
}