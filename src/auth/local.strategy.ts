import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({
            usernameField: 'id',
        });
    }

    async validate(id: string, password: string): Promise<User> {
        try {
            return this.authService.login(id, password);
        } catch (error) {
            throw error;
        }
    }

}

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {}