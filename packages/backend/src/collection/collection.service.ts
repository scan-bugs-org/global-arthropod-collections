import { Inject, Injectable } from '@nestjs/common';
import { Collection, COLLECTION_PROVIDER_ID, GeoJsonCollection } from '../database/models/Collection';
import { Model } from 'mongoose';
import { Institution } from "../database/models/Institution";
import { AppConfigService } from "../app-config/app-config.service";

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

type FindAllParams = {
    iid?: string;
    tier?: number;
    geojson?: boolean;
    user?: string;
}

function stripUndefined(object: Record<string, unknown>): Record<string, unknown> {
    const newObj = {};
    Object.keys(object).forEach((k) => {
        if (object[k] !== undefined) {
            newObj[k] = object[k];
        }
    });
    return newObj;
}

@Injectable()
export class CollectionService {
    private static readonly INSTITUTION_POPULATE = {
        path: "institution",
        select: ["_id", "name"]
    };

    constructor(
        @Inject(COLLECTION_PROVIDER_ID)
        private readonly collection: Model<Collection>,
        private readonly appConfig: AppConfigService) { }

    async findAll(inputParams: FindAllParams): Promise<Collection[] | GeoJsonCollection[]> {
        inputParams = stripUndefined(inputParams);
        const findParams = {};

        if (inputParams.iid) {
            findParams['institution'] = inputParams.iid;
        }

        if (inputParams.tier) {
            findParams['tier'] = inputParams.tier;
        }

        if (inputParams.user && inputParams.user !== this.appConfig.initialAdminUser()) {
            findParams['editors'] = inputParams.user;
        }

        const collections = await this.collection.find(findParams)
            .populate(CollectionService.INSTITUTION_POPULATE)
            .exec();

        if (inputParams.geojson === true) {
            return collections.map((c) => c.asGeoJson());
        }

        return collections;
    }

    async create(collectionData: CollectionData[]): Promise<Collection[]> {
        collectionData = collectionData.map((c) => Object.assign({}, collectionDefaults, c));
        const results = await this.collection.insertMany(
            collectionData as any[]
        ) as Collection[];
        const collIDs = results.map((collection) => collection._id);

        return this.collection.find({ _id: { $in: collIDs } })
            .populate(CollectionService.INSTITUTION_POPULATE)
            .exec();
    }

    async findByID(id: string): Promise<Collection> {
        return this.collection.findById(id)
            .populate(CollectionService.INSTITUTION_POPULATE)
            .exec();
    }

    async updateByID(id: string, updates: Partial<Collection>): Promise<Collection> {
        return this.collection.findOneAndUpdate(
            { _id: id },
            updates,
            { returnOriginal: false }
        ).populate(CollectionService.INSTITUTION_POPULATE).exec();
    }

    async deleteByID(id: string): Promise<boolean> {
        const query = await this.collection.deleteOne({ _id: id }).exec();
        return query.deletedCount === 1;
    }
}
