import { InstitutionOutputDto } from "../../institution/dto/institution.output.dto";
import { CollectionOutputDto } from "../../collection/dto/collection.output.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class MapUploadOutputDto {
    constructor(createdObjects: Record<string, unknown>) {
        Object.assign(this, createdObjects);
    }

    @ApiProperty()
    @Expose()
    @Type(() => InstitutionOutputDto)
    institutions: InstitutionOutputDto[];

    @ApiProperty()
    @Expose()
    @Type(() => CollectionOutputDto)
    collections: CollectionOutputDto[];
}
