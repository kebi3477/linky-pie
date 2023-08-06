import { User } from "src/user/user.entity";

export interface TokenPayload {
    id: string
}

export class RequestWithUser extends Request {
    user: User;
}