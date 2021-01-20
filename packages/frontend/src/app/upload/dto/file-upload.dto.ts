import { Exclude, Expose } from "class-transformer";

@Exclude()
export class FileUpload {
    @Expose()
    _id: string = '';

    @Expose()
    headers: string[] = [];

    @Expose()
    requiredHeaders: string[] = [];

    @Expose()
    optionalHeaders: string[] = [];
}
