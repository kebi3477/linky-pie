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

export class RetrospectiveResponseDto {
    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsInt()
    @IsNotEmpty()
    statusCode: number;

    retrospective: Retrospective|Retrospective[];

    set(status:number, message: string, retrospective: Retrospective|Retrospective[] = null): RetrospectiveResponseDto {
        this.statusCode = status;
        this.message = message;
        this.retrospective = retrospective;
        return this;
    }
}