import { Connection, Document, Schema } from "mongoose";
import { Provider } from "@nestjs/common";
import { DATABASE_PROVIDER_ID } from "../database.provider";


const TmpUploadSchema = new Schema({
    headers: {
        type: [String],
        required: true
    },
    data: {
        type: [Object],
        required: true
    }
});

export interface TmpUpload extends Document {
    headers: string[];
    data: Record<string, unknown>[];
}

function uploadModelFactory(connection: Connection) {
    return connection.model('TmpUpload', TmpUploadSchema);
}

export const TMP_UPLOAD_PROVIDER_ID = "UPLOAD_PROVIDER";
export const TmpUploadProvider: Provider = {
    provide: TMP_UPLOAD_PROVIDER_ID,
    useFactory: uploadModelFactory,
    inject: [DATABASE_PROVIDER_ID]
}
