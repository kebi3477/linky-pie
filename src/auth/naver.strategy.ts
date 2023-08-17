import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-naver";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get('NAVER_CLIENT_ID'),
            clientSecret: configService.get('NAVER_CLIENT_SECRET'),
            callbackURL: configService.get('NAVER_REDIRECT_URL')
        })
    }

    async validate(
        accessToken: string, refreshToken: string, profile: Profile, 
        done: (err: any, user?: any, info?: any) => void
    ) {
        try {
            const { _json } = profile;
            const user = {
                email: _json.email,
                name: _json.nickname,
                image: _json.profile_image,
            };

            done(null, user);
        } catch (error) {
            done(error);
        }
    }
}