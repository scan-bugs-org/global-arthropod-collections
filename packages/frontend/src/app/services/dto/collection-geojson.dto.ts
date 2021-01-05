import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class GeoJsonGeometry {
    @Expose()
    type: string = "";

    @Expose()
    @Type(() => Number)
    coordinates: number[] = [];
}

@Exclude()
class GeoJsonProps {
    @Expose()
    id: string = "";

    @Expose()
    name: string = "";

    @Expose()
    url: string = "";

    @Expose()
    tier: number = -1;
}

@Exclude()
export class CollectionGeoJson {
    @Expose()
    type: 'Point' = 'Point';

    @Expose()
    @Type(() => GeoJsonGeometry)
    geometry: GeoJsonGeometry | null = null;

    @Expose()
    @Type(() => GeoJsonProps)
    properties: GeoJsonProps | null = null;
}
