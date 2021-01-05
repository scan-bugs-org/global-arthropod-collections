import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class LoginOutputDto {
    constructor(loginData: Record<string, unknown>) {
        Object.assign(this, loginData);
    }

    @ApiProperty()
    @Expose()
    apiKey: string;
}
