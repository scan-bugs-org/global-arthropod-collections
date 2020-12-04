import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
    Institution,
    INSTITUTION_PROVIDER_ID,
} from '../database/models/Institution';

type InstitutionData = {
    code: string;
    name: string;
}

@Injectable()
export class InstitutionService {
    constructor(
        @Inject(INSTITUTION_PROVIDER_ID)
        private readonly institution: Model<Institution>) { }

    async findAll(): Promise<Institution[]> {
        return this.institution.find().exec();
    }

    async findByID(id: string): Promise<Institution> {
        return this.institution.findById(id).exec();
    }

    async updateByID(id: string, updates: Partial<Institution>): Promise<Institution> {
        return this.institution.findOneAndUpdate({ _id: id }, updates).exec();
    }

    async create(institution: InstitutionData | InstitutionData[]): Promise<Institution | Institution[]> {
        if (Array.isArray(institution)) {
            return this.institution.insertMany(institution) as Promise<Institution[]>;
        }
        return this.institution.create(institution);
    }

    async deleteByID(id: string): Promise<boolean> {
        const query = await this.institution.deleteOne({ _id: id }).exec();
        return query.deletedCount === 1;
    }
}
