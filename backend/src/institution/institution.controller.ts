import {
    Body,
    Controller, Delete,
    Get,
    NotFoundException,
    Param, Patch, Post,
} from '@nestjs/common';
import { ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { InstitutionService } from './institution.service';
import { InstitutionOutputDto } from './dto/institution.output.dto';
import { InstitutionInputDto } from './dto/institution.input.dto';

@Controller('institutions')
@ApiTags('Institution')
export class InstitutionController {

    constructor(private readonly institutionService: InstitutionService) { }

    @Get()
    async findAll(): Promise<InstitutionOutputDto[]> {
        const institutions = await this.institutionService.findAll();
        return institutions.map((i) => new InstitutionOutputDto(i.toJSON()));
    }

    @Get(':id')
    async findByID(@Param('id') id: string): Promise<InstitutionOutputDto> {
        const institution = await this.institutionService.findByID(id);
        if (!institution) {
            throw new NotFoundException();
        }
        return new InstitutionOutputDto(institution.toJSON());
    }

    @Patch(':id')
    async updateByID(
        @Param('id') id: string,
        @Body() institutionData: InstitutionInputDto): Promise<InstitutionOutputDto> {
        const institution = await this.institutionService.findByID(id);
        if (!institution) {
            throw new NotFoundException();
        }

        const updates = Object.assign(institution, institutionData);
        const updated = await this.institutionService.updateByID(id, updates);

        return new InstitutionOutputDto(updated.toJSON());
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
    async create(
        @Body() institution: InstitutionInputDto | InstitutionInputDto[]): Promise<InstitutionOutputDto | InstitutionOutputDto[]> {
        const created = await this.institutionService.create(institution);
        if (Array.isArray(created)) {
            return created.map((i) => new InstitutionOutputDto(i.toJSON()));
        }
        return new InstitutionOutputDto(created.toJSON());
    }

    @Delete(':id')
    async deleteByID(@Param('id') id: string): Promise<void> {
        const deletedSuccess = await this.institutionService.deleteByID(id);
        if (!deletedSuccess) {
            throw new NotFoundException();
        }
    }
}
