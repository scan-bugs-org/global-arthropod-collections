import { Schema, Document, Connection } from "mongoose";
import { Provider } from "@nestjs/common";
import { DATABASE_PROVIDER_ID } from "../database.provider";

const UserSchema = new Schema({
    _id: String,
    firstLogin: {
        type: Schema.Types.Date,
        required: false,
        default: new Date()
    },
    lastLogin: {
        type: Schema.Types.Date,
        required: false,
        default: new Date()
    }
});

export interface User extends Document {
    _id: string;
    firstLogin: Date;
    lastLogin: Date;
}

function userModelFactory(connection: Connection) {
    return connection.model("User", UserSchema);
}

export const USER_PROVIDER_ID = "USER_PROVIDER";
export const UserProvider: Provider = {
    provide: USER_PROVIDER_ID,
    useFactory: userModelFactory,
    inject: [DATABASE_PROVIDER_ID]
};
