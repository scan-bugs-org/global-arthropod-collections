import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HeaderMappingInputDto {
    @ApiProperty()
    @IsString()
    institutionName: string;

    @ApiProperty()
    @IsString()
    institutionCode: string;

    @ApiProperty()
    @IsString()
    collectionCode: string;

    @ApiProperty()
    @IsString()
    collectionName: string;

    @ApiProperty()
    @IsString()
    size: string;

    @ApiProperty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsString()
    state: string;

    @ApiProperty()
    @IsString()
    lat: string;

    @ApiProperty()
    @IsString()
    lng: string;

    @ApiProperty()
    @IsString()
    tier: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty()
    @IsString()
    inIdigbio: string;

    @ApiProperty()
    @IsString()
    scanExists: string;

    @ApiProperty()
    @IsString()
    scanType: string;

    @ApiProperty()
    @IsString()
    gbifExists: string;

    @ApiProperty()
    @IsString()
    gbifDate: string;
}
