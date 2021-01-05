import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HeaderMappingOutputDto {
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    @ApiProperty()
    @Expose()
    institutions: string[];

    @ApiProperty()
    @Expose()
    collections: string[];
}
