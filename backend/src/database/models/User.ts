import bcrypt from 'bcrypt';
import { Schema, Document, Connection } from 'mongoose';
import { Provider } from '@nestjs/common';
import { DatabaseConfigService } from '../database-config.service';
import { DATABASE_PROVIDER_ID } from '../database.provider';

// 2-3 hashes/sec
const saltRounds = 12;

const UserSchema = new Schema({
  _id: String,
  password: {
    type: String,
    required: true,
    set: setPassword
  }
});

export interface User extends Document {
    _id: string;
    password: string;
    verifyPassword?: (plainText: string) => boolean
}

function setPassword(plainTextStr): string {
    return bcrypt.hashSync(plainTextStr, saltRounds);
}

function verifyPassword(plainTextStr): boolean {
    return bcrypt.compareSync(plainTextStr, this.password);
}

function userModelFactory(connection: Connection) {
    return connection.model('User', UserSchema);
}

export const USER_PROVIDER_ID = "USER_PROVIDER";
export const UserProvider: Provider = {
    provide: USER_PROVIDER_ID,
    useFactory: userModelFactory,
    inject: [DATABASE_PROVIDER_ID]
}

UserSchema.methods.verifyPassword = verifyPassword;
