import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GeoJsonCollection } from '../../database/models/Collection';

class GeoJsonGeometry {
    @ApiProperty()
    @Expose()
    type: string;

    @ApiProperty()
    @Expose()
    @Type(() => Number)
    coordinates: number[];
}

class GeoJsonProps {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    url: string;

    @ApiProperty()
    @Expose()
    tier: number;
}

export class GeoJsonOutputDto {
    constructor(collection: Partial<GeoJsonCollection>) {
        Object.assign(this, collection);
    }

    @ApiProperty()
    @Expose()
    type: string;

    @ApiProperty()
    @Expose()
    @Type(() => GeoJsonGeometry)
    geometry: GeoJsonGeometry;

    @ApiProperty()
    @Expose()
    @Type(() => GeoJsonProps)
    properties: GeoJsonProps;
}
