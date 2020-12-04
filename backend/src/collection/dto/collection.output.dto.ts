import { Schema } from "mongoose";
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Collection } from '../../database/models/Collection';

const ObjectId = Schema.Types.ObjectId;

class CollectionLocationDto {
    @ApiProperty()
    @Expose()
    country: string;

    @ApiProperty()
    @Expose()
    state: string;

    @ApiProperty()
    @Expose()
    lat: number;

    @ApiProperty()
    @Expose()
    lng: number;
}

class CollectionScanDto {
    @ApiProperty()
    @Expose()
    exists: boolean;

    @ApiProperty()
    @Expose()
    scanType: string;
}

class CollectionGbifDto {
    @ApiProperty()
    @Expose()
    exists: boolean;

    @ApiProperty()
    @Expose()
    date: Date;
}

export class CollectionOutputDto {
    constructor(institution: Partial<Collection>) {
        Object.assign(this, institution);
    }

    @ApiProperty()
    @Expose()
    @Type(() => ObjectId)
    @Transform((id: typeof ObjectId) => id.toString(), { toPlainOnly: true })
    _id: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    @Type(() => ObjectId)
    @Transform((id: typeof ObjectId) => id.toString(), { toPlainOnly: true })
    institution: string;

    @ApiProperty()
    @Expose()
    code: string;

    @ApiProperty()
    @Expose()
    size: number;

    @ApiProperty()
    @Expose()
    @Type(() => CollectionLocationDto)
    location: CollectionLocationDto;

    @ApiProperty()
    @Expose()
    tier: number;

    @ApiProperty()
    @Expose()
    url: number;

    @ApiProperty()
    @Expose()
    inIdigbio: boolean;

    @ApiProperty()
    @Expose()
    @Type(() => CollectionScanDto)
    scan: CollectionScanDto;

    @ApiProperty()
    @Expose()
    @Type(() => CollectionGbifDto)
    gbif: CollectionGbifDto;
}
