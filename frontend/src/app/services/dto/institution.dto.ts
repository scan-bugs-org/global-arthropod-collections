import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Institution {
    @Expose()
    _id: string = "";

    @Expose()
    name: string = "";

    @Expose()
    code: string = "";
}
