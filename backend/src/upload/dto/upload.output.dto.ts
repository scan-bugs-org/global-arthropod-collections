import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Schema } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;



export class UploadOutputDto {
    private static readonly REQUIRED_HEADERS = [
        "collectionName",
        "collectionSize",
        "latitude",
        "longitude"
    ];

    private static readonly OPTIONAL_HEADERS = [
        "institutionName",
        "institutionCode",
        "country",
        "state",
        "tier",
        "url"
    ];

    constructor(uploadData: Record<string, unknown>) {
        Object.assign(this, uploadData);
    }

    @ApiProperty()
    @Expose()
    @Type(() => ObjectId)
    @Transform((id) => id.toString(), { toPlainOnly: true })
    _id: string;

    @ApiProperty()
    @Expose()
    headers: string[];

    @ApiProperty()
    @Expose()
    readonly requiredHeaders: string[] = UploadOutputDto.REQUIRED_HEADERS;

    @ApiProperty()
    @Expose()
    readonly optionalHeaders: string[] = UploadOutputDto.OPTIONAL_HEADERS;
}
