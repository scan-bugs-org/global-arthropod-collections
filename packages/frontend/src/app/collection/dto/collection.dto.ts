import { Exclude, Expose } from "class-transformer";

@Exclude()
class CollectionLocationDto {
    @Expose()
    country: string = "";

    @Expose()
    state: string = "";

    @Expose()
    lat: number = 0;

    @Expose()
    lng: number = 0;
}

class CollectionInstitutionDto {
    @Expose()
    _id: string = "";

    @Expose()
    name: string = "";
}

class CollectionScanDto {
    @Expose()
    exists?: boolean;

    @Expose()
    scanType: string = "";
}

class CollectionGbifDto {
    @Expose()
    exists?: boolean;

    @Expose()
    date?: Date;
}

export class Collection {
    @Expose()
    _id: string = "";

    @Expose()
    name: string = "";

    @Expose()
    institution?: CollectionInstitutionDto;

    @Expose()
    code: string = "";

    @Expose()
    size: number = 0;

    @Expose()
    location?: CollectionLocationDto;

    @Expose()
    tier: number = 4;

    @Expose()
    url: string = "";

    @Expose()
    inIdigbio: boolean = false;

    @Expose()
    scan?: CollectionScanDto;

    @Expose()
    gbif?: CollectionGbifDto;
}
