import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import {
    Institution,
    INSTITUTION_PROVIDER_ID
} from "../database/models/Institution";
import {
    Collection,
    COLLECTION_PROVIDER_ID
} from "../database/models/Collection";
import { AppConfigService } from "../app-config/app-config.service";

type InstitutionData = {
    code: string;
    name: string;
}

interface FindAllParams {
    user?: string;
}

@Injectable()
export class InstitutionService {
    constructor(
        private readonly appConfig: AppConfigService,
        @Inject(INSTITUTION_PROVIDER_ID)
        private readonly institution: Model<Institution>,
        @Inject(COLLECTION_PROVIDER_ID)
        private readonly collection: Model<Collection>) { }

    async findAll(params?: FindAllParams): Promise<Institution[]> {
        const findParams = {};

        if (params && params.user && params.user !== this.appConfig.initialAdminUser()) {
            findParams['editors'] = params.user;
        }

        return this.institution.find(findParams).exec();
    }

    async findByID(id: string): Promise<Institution> {
        return this.institution.findById(id).exec();
    }

    async updateByID(id: string, updates: Partial<Institution>): Promise<Institution> {
        return this.institution.findOneAndUpdate(
            { _id: id },
            updates,
            { returnOriginal: false }
        ).exec();
    }

    async create(institution: InstitutionData | InstitutionData[]): Promise<Institution | Institution[]> {
        if (Array.isArray(institution)) {
            return this.institution.insertMany(institution) as Promise<Institution[]>;
        }
        return this.institution.create(institution);
    }

    async deleteByID(id: string): Promise<boolean> {
        const query = await this.institution.deleteOne({ _id: id }).exec();
        const deleted = query.deletedCount;

        if (deleted === 1) {
            await this.collection.deleteMany({ institution: id });
        }

        return deleted === 1;
    }
}
