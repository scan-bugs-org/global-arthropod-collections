import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private users: UserService) {
        super();
    }

    async validate(username: string, password: string): Promise<string> {
        const user = await this.users.login(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user._id;
    }
}
