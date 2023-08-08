import { User } from "../user/user.entity";

export interface TokenPayload {
    id: string
}

export class RequestWithUser extends Request {
    user: User;
}