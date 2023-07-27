import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private userService: UserService) {
        super({
            usernameField: 'id',
        });
    }

    async validate(id: string, password: string): Promise<User> {
        try {
            return this.userService.login(id, password);
        } catch (error) {
            throw error;
        }
    }

}

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {}