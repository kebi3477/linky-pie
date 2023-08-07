import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Block } from "src/block/block.entity";
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

export class RetrospectiveResponseDto<T> {
    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsInt()
    @IsNotEmpty()
    statusCode: number;

    retrospective: T;

    set(status:number, message: string, retrospective: T = null): RetrospectiveResponseDto<T> {
        this.statusCode = status;
        this.message = message;
        this.retrospective = retrospective;
        return this;
    }
}