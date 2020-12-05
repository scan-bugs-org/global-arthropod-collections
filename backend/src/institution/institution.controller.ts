import {
    Body,
    Controller, Delete,
    Get, HttpCode, HttpStatus,
    NotFoundException,
    Param, Patch, Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { InstitutionService } from './institution.service';
import { InstitutionOutputDto } from './dto/institution.output.dto';
import { InstitutionInputDto } from './dto/institution.input.dto';
import { CollectionOutputDto } from '../collection/dto/collection.output.dto';

@Controller('institutions')
@ApiTags('Institution')
export class InstitutionController {

    constructor(private readonly institutionService: InstitutionService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: InstitutionOutputDto, isArray: true })
    async findAll(): Promise<InstitutionOutputDto[]> {
        const institutions = await this.institutionService.findAll();
        return institutions.map((i) => new InstitutionOutputDto(i.toJSON()));
    }

    @Post()
    @ApiBody({
        schema: {
            oneOf: [
                { $ref: getSchemaPath(InstitutionInputDto) },
                { type: 'array', items: { $ref: getSchemaPath(InstitutionInputDto) } }
            ]
        }
    })
    @ApiResponse({
        status: HttpStatus.OK,
        schema: {
            oneOf: [
                { $ref: getSchemaPath(InstitutionOutputDto) },
                { type: 'array', items: { $ref: getSchemaPath(InstitutionOutputDto) } }
            ]
        }
    })
    async create(
        @Body() institution: InstitutionInputDto | InstitutionInputDto[]): Promise<InstitutionOutputDto | InstitutionOutputDto[]> {
        const created = await this.institutionService.create(institution);
        if (Array.isArray(created)) {
            return created.map((i) => new InstitutionOutputDto(i.toJSON()));
        }
        return new InstitutionOutputDto(created.toJSON());
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: InstitutionOutputDto })
    async findByID(@Param('id') id: string): Promise<InstitutionOutputDto> {
        const institution = await this.institutionService.findByID(id);
        if (!institution) {
            throw new NotFoundException();
        }
        return new InstitutionOutputDto(institution.toJSON());
    }

    @Patch(':id')
    @ApiResponse({ status: HttpStatus.OK, type: InstitutionOutputDto })
    async updateByID(
        @Param('id') id: string,
        @Body() institutionData: InstitutionInputDto): Promise<InstitutionOutputDto> {
        const updated = await this.institutionService.updateByID(id, institutionData);
        if (!updated) {
            throw new NotFoundException();
        }
        return new InstitutionOutputDto(updated.toJSON());
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteByID(@Param('id') id: string): Promise<void> {
        const deletedSuccess = await this.institutionService.deleteByID(id);
        if (!deletedSuccess) {
            throw new NotFoundException();
        }
    }
}