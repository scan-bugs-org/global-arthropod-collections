import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from "../../app-config/app-config.service";
import { UserService } from "../user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly appConfig: AppConfigService,
        private readonly users: UserService) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appConfig.jwtKey(),
        });
    }

    async validate(payload: Record<string, string>) {
        return await this.users.findAccessToken(
            payload.sub,
            payload.accessToken
        );
    }
}
