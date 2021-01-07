import { Inject, Injectable, Logger } from "@nestjs/common";
import { User, USER_PROVIDER_ID } from '../database/models/User';
import { LeanDocument, Model } from "mongoose";
import { v4 as uuid4 } from 'uuid';
import {
    OAUTH_TOKEN_PROVIDER_ID,
    OAuthToken
} from "../database/models/OAuthToken";

@Injectable()
export class UserService {
    private logger: Logger;

    constructor(
        @Inject(OAUTH_TOKEN_PROVIDER_ID) private readonly userTokens: Model<OAuthToken>,
        @Inject(USER_PROVIDER_ID) private readonly user: Model<User>) {

        this.logger = new Logger(UserService.name);
        this.createAdminUser().catch(this.logger.error.bind(this));
    }

    private async createAdminUser(): Promise<void> {
        const adminUser = await this.user.findById('admin');
        if (adminUser) {
            this.logger.log('Found existing admin user');
        }
        else {
            const password = uuid4();
            const adminUser = {
                _id: 'admin',
                password: password
            };
            await this.user.create(adminUser);
            this.logger.warn(`Added admin user with password ${ password }`);
            this.logger.warn('Please change the admin password');
        }
    }

    async login(username: string, password: string): Promise<User> {
        const user = await this.user.findById(username).exec();
        if (!!user && user.verifyPassword(password)) {
            return user;
        }
        return null;
    }

    async createToken(username: string): Promise<OAuthToken> {
        const user = await this.user.findById(username).populate('tokens').exec();

        if (user === null) {
            return null;
        }

        return await this.userTokens.create({
            user: user._id,
            accessToken: uuid4(),
            refreshToken: uuid4(),
        });
    }

    async findRefreshToken(username: string, token: string): Promise<LeanDocument<OAuthToken>> {
        return this.userTokens.findOne(
            { user: username, refreshToken: token }
        ).lean().exec();
    }

    async findAccessToken(username: string, token: string): Promise<LeanDocument<OAuthToken>> {
        return this.userTokens.findOne(
            { user: username, accessToken: token }
        ).lean().exec();
    }
}
