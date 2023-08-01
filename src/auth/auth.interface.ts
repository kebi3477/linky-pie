import { User } from "src/entity/user.entity";

export interface TokenPayload {
    id: string
}

export class RequestWithUser extends Request {
    user: User;
}