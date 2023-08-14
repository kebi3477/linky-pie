import { IsOptional, IsString } from "class-validator";

export class KakaoLoginAuthOutputDTO {
    @IsOptional()
    @IsString()
    accessToken?: string;
}