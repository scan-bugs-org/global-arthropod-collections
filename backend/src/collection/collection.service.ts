import { Inject, Injectable } from '@nestjs/common';
import {
    Collection,
    COLLECTION_PROVIDER_ID,
} from '../database/models/Collection';
import { Model } from 'mongoose';

@Injectable()
export class CollectionService {
    constructor(
        @Inject(COLLECTION_PROVIDER_ID) private readonly collection: Model<Collection>) { }

    async findAll(): Promise<Collection[]> {
        return this.collection.find();
    }

    async findByInstitution(institutionID: string): Promise<Collection[]> {
        return this.collection.find({ institution: institutionID });
    }
}
