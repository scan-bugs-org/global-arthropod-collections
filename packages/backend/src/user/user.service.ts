import { Inject, Injectable } from "@nestjs/common";
import { User, USER_PROVIDER_ID } from '../database/models/User';
import { Model } from "mongoose";

@Injectable()
export class UserService {
    constructor(@Inject(USER_PROVIDER_ID) private readonly user: Model<User>) { }

    async findOrCreate(id: string): Promise<User> {
        return this.user.findOneAndUpdate(
            { _id: id },
            {
                _id: id,
                lastLogin: new Date()
            },
            { upsert: true, returnOriginal: false }
        );
    }
}
