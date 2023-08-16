import { User } from "../user/user.entity";

export interface TokenPayload {
    id: string
}

export class RequestWithUser {
    user: User;
}

type SocialUser = {
    email: string;
    name: string;
    image: string;
}

export type SocialRequest = Request & { user: SocialUser };