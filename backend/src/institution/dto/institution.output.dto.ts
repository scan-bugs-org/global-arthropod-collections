import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Institution } from '../../database/models/Institution';
import { Schema } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export class InstitutionOutputDto {
    constructor(institution: Partial<Institution>) {
        Object.assign(this, institution);
    }

    @ApiProperty()
    @Expose()
    @Type(() => ObjectId)
    @Transform((id: typeof ObjectId) => id.toString(), { toPlainOnly: true })
    _id: string;

    @ApiProperty()
    @Expose()
    code: string;

    @ApiProperty()
    @Expose()
    name: string;
}
