import { User } from "../user/user.entity";

export interface TokenPayload {
    id: string
}

export class RequestWithUser {
    user: User;
}

type KakaoUser = {
    email: string,
    nickname: string;
}

export type KakaoRequest = Request & { user: KakaoUser }

type GoogleUser = {
    email: string;
    name: string;
    photo: string;
};
  
export type GoogleRequest = Request & { user: GoogleUser };