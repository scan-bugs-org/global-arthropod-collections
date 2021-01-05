import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
    TMP_UPLOAD_PROVIDER_ID,
    TmpUpload
} from "../database/models/TmpUpload";
import { Model } from "mongoose";
import { HeaderMappingInputDto } from "./dto/header-mapping.input.dto";
import { CsvFile } from "./csv-file.interceptor";
import { InstitutionInputDto } from "../institution/dto/institution.input.dto";
import {
    Institution,
    INSTITUTION_PROVIDER_ID
} from "../database/models/Institution";
import {
    Collection,
    COLLECTION_PROVIDER_ID
} from "../database/models/Collection";
import { CollectionInputDto } from "../collection/dto/collection.input.dto";
import { MapUploadOutputDto } from "./dto/map-upload.output.dto";
import { HeaderMappingOutputDto } from "./dto/header-mapping.output.dto";
import { map } from "rxjs/operators";

type MappingOutput = {
    institutions: Institution[];
    collections: Collection[];
};

@Injectable()
export class UploadService {
    constructor(
        @Inject(TMP_UPLOAD_PROVIDER_ID)
        private readonly upload: Model<TmpUpload>,
        @Inject(INSTITUTION_PROVIDER_ID)
        private readonly institution: Model<Institution>,
        @Inject(COLLECTION_PROVIDER_ID)
        private readonly collection: Model<Collection>) {
    }

    async create(data: CsvFile): Promise<string> {
        const upload = await this.upload.create(data);
        return upload._id;
    }

    async findByID(id: string): Promise<TmpUpload> {
        return this.upload.findById(id).exec();
    }

    async deleteByID(id: string): Promise<boolean> {
        const result = await this.upload.deleteOne({ _id: id }).exec();
        return result.deletedCount === 1;
    }

    async mapUpload(
        upload: TmpUpload,
        mappings: HeaderMappingInputDto): Promise<MappingOutput> {

        const newInstitutions = [];
        const newCollections = [];

        for (const row of upload.data) {
            const institution: InstitutionInputDto = {
                code: row[mappings.institutionCode] as string,
                name: row[mappings.institutionName] as string
            };
            newInstitutions.push(institution);
        }

        const institutions = await this.institution.insertMany(
            newInstitutions,
            { lean: true }
        ) as Institution[];

        for (let instIdx = 0; instIdx < institutions.length; instIdx++) {
            const iid = institutions[instIdx]._id;
            const row = upload.data[instIdx];

            const collection: CollectionInputDto = {
                name: row[mappings.collectionName] as string,
                code: row[mappings.collectionName] as string || null,
                institution: iid,
                size: row[mappings.size] as number || 0,
                location: {
                    country: row[mappings.country] as string,
                    state: row[mappings.state] as string,
                    lat: row[mappings.latitude] as number,
                    lng: row[mappings.longitude] as number
                },
                tier: row[mappings.tier] as number || 4,
                url: row[mappings.url] as string || null,
                inIdigbio: row[mappings.inIdigbio] as boolean || null,
                scan: {
                    exists: row[mappings.scanExists] as boolean || null,
                    scanType: row[mappings.scanType] as string || null
                },
                gbif: {
                    exists: row[mappings.gbifExists] as boolean || null,
                    date: row[mappings.gbifDate] as Date || null
                }
            };
            newCollections.push(collection);
        }

        const collections = await this.collection.insertMany(newCollections) as Collection[];

        await this.upload.deleteOne({ _id: upload._id }).exec();
        return { institutions, collections };
    }
}
