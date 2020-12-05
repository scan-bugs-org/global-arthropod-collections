import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HeaderMappingOutputDto {
    @ApiProperty()
    @Expose()
    institutions: string[];

    @ApiProperty()
    @Expose()
    collections: string[];
}
