import { Connection, Schema, Document } from 'mongoose';
import { Provider } from '@nestjs/common';
import { DatabaseService } from '../database.service';

const SchemaTypes = Schema.Types;

const CollectionSchema = new Schema({
    code: {
        type: String,
    },
    institution: {
        type: SchemaTypes.ObjectId,
        ref: 'Institution',
    },
    name: {
        type: String,
        required: true,
        default: 'Entomology Collection',
    },
    size: {
        type: Number,
        required: true,
        default: 0,
    },
    location: {
        country: String,
        state: String,
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    tier: {
        type: Number,
        required: true,
        default: 4,
    },
    url: String,
    inIdigbio: Boolean,
    scan: {
        exists: Boolean,
        scanType: String,
    },
    gbif: {
        exists: Boolean,
        date: Date,
    },
});

export interface Collection extends Document {
    readonly code: string;
    readonly institution: string;
    readonly name: string;
    readonly size: number;
    readonly location: {
        readonly country: string;
        readonly state: string;
        readonly lat: number;
        readonly lng: number;
    };
    readonly tier: number;
    readonly url: string;
    readonly inIdigbio: boolean;
    readonly scan: {
        readonly exists: boolean;
        readonly scanType: string;
    },
    readonly gbif: {
        readonly exists: boolean,
        readonly date: Date
    }
}

export interface GeoJsonCollection {
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    },
    properties: {
        id: string;
        name: string;
        url: string;
        tier: number;
    }
}

function collectionModelFactory(connection: Connection) {
    return connection.model('Collection', CollectionSchema);
}

export const COLLECTION_PROVIDER_ID = 'COLLECTION_MODEL';
export const CollectionProvider: Provider = {
    provide: COLLECTION_PROVIDER_ID,
    useFactory: collectionModelFactory,
    inject: [DatabaseService.PROVIDER_ID],
};

CollectionSchema.methods.asGeoJson = function(): GeoJsonCollection {
    let name = this.name;
    if (this.institution !== null) {
        name = `${ this.institution.name } ${ this.name }`;
    }
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [this.location.lng, this.location.lat],
        },
        properties: {
            id: this._id,
            name: name,
            url: this.url,
            tier: this.tier,
        },
    };
};
