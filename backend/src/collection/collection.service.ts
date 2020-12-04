import { Inject, Injectable } from '@nestjs/common';
import {
    Collection,
    COLLECTION_PROVIDER_ID,
} from '../database/models/Collection';
import { Model } from 'mongoose';

interface CollectionData {
    code?: string;
    institution?: string;
    name?: string;
    size?: number;
    location: {
        country?: string;
        state?: string;
        lat: number;
        lng: number;
    },
    tier?: number;
    url?: string;
    inIdigbio?: boolean;
    scan?: {
        exists?: boolean;
        scanType?: string;
    };
    gbif: {
        exists?: boolean;
        date?: Date;
    }
}

const collectionDefaults = {
    name: 'Entomology Collection',
    institution: null,
    code: null,
    size: 0,
    location: {
        country: null,
        state: null
    },
    tier: 4,
    url: null,
    inIdigbio: null,
    scan: {
        exists: null,
        scanType: null,
    },
    gbif: {
        exists: null,
        date: null
    }
};

@Injectable()
export class CollectionService {
    constructor(
        @Inject(COLLECTION_PROVIDER_ID) private readonly collection: Model<Collection>) { }

    async findAll(): Promise<Collection[]> {
        return this.collection.find().exec();
    }

    async findByInstitution(institutionID: string): Promise<Collection[]> {
        return this.collection.find({ institution: institutionID }).exec();
    }

    async create(collectionData: CollectionData[]): Promise<Collection[]> {
        collectionData = collectionData.map((c) => Object.assign({}, collectionDefaults, c));
        return this.collection.insertMany(collectionData as any[]) as Promise<Collection[]>;
    }

    async findByID(id: string): Promise<Collection> {
        return this.collection.findById(id).exec();
    }

    async updateByID(id: string, updates: Partial<Collection>): Promise<Collection> {
        return this.collection.findOneAndUpdate(
            { _id: id }, updates, { returnOriginal: false }
        ).exec();
    }
}
