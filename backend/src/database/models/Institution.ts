import { Connection, Schema, Document } from 'mongoose';
import { Provider } from '@nestjs/common';
import { DatabaseService } from '../database.service';

const InstitutionSchema = new Schema({
  code: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    unique: true
  },
});

export interface Institution extends Document {
    readonly code: string;
    readonly name: string;
}

async function deleteAssociatedCollections() {
    try {
        await this.model("Collection").deleteMany({ institution: this._id });
    } catch (e) {
        console.error(`Error deleting institution: ${e.message}`);
        throw e;
    }
}

function institutionModelFactory(connection: Connection) {
    return connection.model('Institution', InstitutionSchema);
}

InstitutionSchema.pre("remove", deleteAssociatedCollections);
InstitutionSchema.pre("deleteOne", deleteAssociatedCollections);

export const INSTITUTION_PROVIDER_ID = "INSTITUTION_PROVIDER";
export const InstitutionProvider: Provider = {
    provide: INSTITUTION_PROVIDER_ID,
    useFactory: institutionModelFactory,
    inject: [DatabaseService.PROVIDER_ID]
}
