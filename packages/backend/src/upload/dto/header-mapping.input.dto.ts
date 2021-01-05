import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";
import { HeaderMappingInputInterface } from "@arthropodindex/common";

export class HeaderMappingInputDto implements HeaderMappingInputInterface {
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
    @IsNotEmpty()
    collectionName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    size: string;

    @ApiProperty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsString()
    state: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    latitude: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    longitude: string;

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
