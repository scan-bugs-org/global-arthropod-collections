import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsObject } from 'class-validator';

export class HeaderMappingInputDto {
    @ApiProperty()
    @Expose()
    @IsObject()
    headerMap: Record<string, string>;
}
