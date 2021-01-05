import { Exclude, Expose } from "class-transformer";

@Exclude()
export class HeaderMapping {
    @Expose()
    institutions: string[] = [];

    @Expose()
    collections: string[] = [];
}
