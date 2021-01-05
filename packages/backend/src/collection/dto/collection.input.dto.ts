import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsBoolean, IsDateString, IsHexadecimal,
    IsNumber, IsObject,
    IsOptional,
    IsString, Length, Max, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

class CollectionLocationInputDto {
    @ApiProperty({ required: false })
    @IsString()
    @Optional()
    state: string;

    @ApiProperty({ required: false })
    @IsString()
    @Optional()
    country: string;

    @ApiProperty()
    @IsNumber()
    lat: number;

    @ApiProperty()
    @IsNumber()
    lng: number;
}

class CollectionScanInputDto {
    @ApiProperty({ required: false })
    @IsBoolean()
    @Optional()
    exists: boolean;

    @ApiProperty()
    @IsString()
    @Optional()
    scanType: string;
}

class CollectionGbifInputDto {
    @ApiProperty()
    @IsBoolean()
    @Optional()
    exists: boolean;

    @ApiProperty()
    @IsDateString()
    @Optional()
    date: Date;
}

export class CollectionInputDto {
    @ApiProperty({ default: 'Entomology Collection', required: false })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Length(24, 24)
    @IsHexadecimal()
    institution: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    code: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    size: number;

    @ApiProperty()
    @Type(() => CollectionLocationInputDto)
    @IsObject()
    location: CollectionLocationInputDto;

    @ApiProperty({ required: false, default: 4 })
    @IsNumber()
    @Optional()
    @Min(1)
    @Max(4)
    tier: number;

    @ApiProperty({ required: false })
    @IsString()
    @Optional()
    url: string;

    @ApiProperty({ required: false })
    @IsBoolean()
    @Optional()
    inIdigbio: boolean;

    @ApiProperty({ required: false })
    @IsObject()
    @Optional()
    @Type(() => CollectionScanInputDto)
    scan: CollectionScanInputDto;

    @ApiProperty({ required: false })
    @IsObject()
    @Optional()
    @Type(() => CollectionGbifInputDto)
    gbif: CollectionGbifInputDto;
}

export class CollectionUpdateDto extends PartialType(CollectionInputDto) {}
