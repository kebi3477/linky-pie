import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_KEY'),
            clientSecret: configService.get('GOOGLE_CLIENT_PASSWORD'),
            callbackURL: configService.get('GOOGLE_REDIRECT_URL'),
            scope: ['email', 'profile'],
        })
    }

    authorizationParams(): { [key: string]: string } {
        return {
            access_type: 'offline',
            prompt: 'consent'
        }
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
        try {
            const { displayName, emails, photos } = profile;
            const user = {
                email: emails[0].value,
                name: displayName,
                image: photos[0].value
            }

            done(null, user);
        } catch (error) {
            done(error);
        }
    }
}