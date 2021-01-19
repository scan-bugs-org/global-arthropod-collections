import { Connection, Schema, Document } from "mongoose";
import { Provider } from "@nestjs/common";
import { DATABASE_PROVIDER_ID } from "../database.provider";

const InstitutionSchema = new Schema({
    code: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        unique: true
    },
    editors: [{
        type: String,
        ref: 'User'
    }]
});

export interface Institution extends Document {
    readonly code: string;
    readonly name: string;
}

function institutionModelFactory(connection: Connection) {
    return connection.model("Institution", InstitutionSchema);
}

export const INSTITUTION_PROVIDER_ID = "INSTITUTION_PROVIDER";
export const InstitutionProvider: Provider = {
    provide: INSTITUTION_PROVIDER_ID,
    useFactory: institutionModelFactory,
    inject: [DATABASE_PROVIDER_ID]
};
