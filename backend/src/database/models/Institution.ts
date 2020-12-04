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

function institutionModelFactory(connection: Connection) {
    return connection.model('Institution', InstitutionSchema);
}

export const INSTITUTION_PROVIDER_ID = "INSTITUTION_PROVIDER";
export const InstitutionProvider: Provider = {
    provide: INSTITUTION_PROVIDER_ID,
    useFactory: institutionModelFactory,
    inject: [DatabaseService.PROVIDER_ID]
}
