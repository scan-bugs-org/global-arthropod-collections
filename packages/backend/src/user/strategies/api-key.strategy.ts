import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { UserService } from "../user.service";
import { User } from "../../database/models/User";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(private users: UserService) {
        super(
            { header: 'Authorization', prefix: 'Api-Key ' },
            false,
            async (apiKey: string, done: (err: Error, user: User) => any) => {
                const user = await this.users.checkApiKey(apiKey);
                return done(null, user);
            }
        );
    }
}
