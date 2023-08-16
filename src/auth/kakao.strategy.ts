import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-kakao";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get('KAKAO_REST_API_KEY'),
            clientSecret: '',
            callbackURL: configService.get('KAKAO_REDIRECT_URL')
        })
    }

    async validate(
        accessToken: string, refreshToken: string, profile: Profile, 
        done: (err: any, user?: any, info?: any) => void
    ) {
        try {
            const { _json } = profile;
            const user = {
                email: _json.kakao_account.email,
                name: _json.properties.nickname,
                image: _json.properties.profile_image,
            };

            done(null, user);
        } catch (error) {
            done(error);
        }
    }
}