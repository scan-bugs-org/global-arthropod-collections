import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CollectionListItem {
    @Expose()
    _id: string = "";

    @Expose()
    name: string = "";

    @Expose()
    institution: string = "";
}
