import { Exclude, Expose } from "class-transformer";

@Exclude()
export class User {
    constructor(userData: Record<string, unknown>) {
        Object.assign(this, userData);
    }

    @Expose()
    username: string = "";

    @Expose()
    apiKey: string = "";
}
