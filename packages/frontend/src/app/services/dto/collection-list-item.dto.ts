import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CollectionInstitution {
    @Expose()
    _id: string = "";

    @Expose()
    name: string = "";
}

@Exclude()
export class CollectionListItem {
    @Expose()
    _id: string = "";

    @Expose()
    name: string = "";

    @Expose()
    @Type(() => CollectionInstitution)
    institution: CollectionInstitution | null = null;
}
