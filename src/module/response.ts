import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class Response<T> {
    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsInt()
    @IsNotEmpty()
    statusCode: number;

    data: T;

    set(status: number, message: string, data: T = null): Response<T> {
        this.statusCode = status;
        this.message = message;
        this.data = data;
        return this;
    }
}