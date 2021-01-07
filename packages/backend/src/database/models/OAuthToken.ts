import { Connection, Schema, Document } from 'mongoose';
import { Provider } from '@nestjs/common';
import { DATABASE_PROVIDER_ID } from '../database.provider';
import { User } from "./User";
const SchemaTypes = Schema.Types;

const OAuthTokenSchema = new Schema({
    accessToken: {
        type: String
    },
    accessTokenExpiresOn: {
        type: Date
    },
    clientId: {
        type: String
    },
    refreshToken: {
        type: String
    },
    refreshTokenExpiresOn: {
        type: Date
    },
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'User'
    }
});

export interface OAuthToken extends Document {
    readonly accessToken: string;
    readonly accessTokenExpiresOn: Date;
    readonly clientId: string;
    readonly refreshToken: string;
    readonly refreshTokenExpiresOn: Date;
    readonly user: Promise<User>;
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
