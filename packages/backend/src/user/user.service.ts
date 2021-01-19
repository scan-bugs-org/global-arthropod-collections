import { Inject, Injectable } from "@nestjs/common";
import { User, USER_PROVIDER_ID } from '../database/models/User';
import { Model } from "mongoose";
import { AppConfigService } from "../app-config/app-config.service";
import {
    Collection,
    COLLECTION_PROVIDER_ID
} from "../database/models/Collection";
import { INSTITUTION_PROVIDER_ID } from "../database/models/Institution";

@Injectable()
export class UserService {
    constructor(
        private readonly appConfig: AppConfigService,
        @Inject(USER_PROVIDER_ID) private readonly user: Model<User>,
        @Inject(COLLECTION_PROVIDER_ID) private readonly collections: Model<Collection>,
        @Inject(INSTITUTION_PROVIDER_ID) private readonly institutions: Model<Collection>) { }

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

    async isCollectionEditor(collectionID: string, userID: string): Promise<boolean> {
        if (userID === this.appConfig.initialAdminUser()) {
            return true;
        }

        const collectionCount = await this.collections.count(
            { _id: collectionID, editors: userID }
        );
        return collectionCount > 0;
    }

    async isInstitutionEditor(institutionID: string, userID: string): Promise<boolean> {
        if (userID === this.appConfig.initialAdminUser()) {
            return true;
        }

        const institutionCount = await this.institutions.count(
            { _id: institutionID, editors: userID }
        );
        return institutionCount > 0;
    }
}
