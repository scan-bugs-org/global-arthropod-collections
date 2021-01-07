import { Connection, Schema, Document } from 'mongoose';
import { Provider } from '@nestjs/common';
import { DATABASE_PROVIDER_ID } from '../database.provider';
import { User } from "./User";

const OAuthTokenSchema = new Schema({
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    user: {
        type: String,
        ref: 'User'
    }
});

export interface OAuthToken extends Document {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly user: User | string;
}

function oAuthTokenModelFactory(connection: Connection) {
    return connection.model('OAuthToken', OAuthTokenSchema);
}

export const OAUTH_TOKEN_PROVIDER_ID = "OAUTH_TOKEN_PROVIDER";
export const OAuthTokenProvider: Provider = {
    provide: OAUTH_TOKEN_PROVIDER_ID,
    useFactory: oAuthTokenModelFactory,
    inject: [DATABASE_PROVIDER_ID]
}
