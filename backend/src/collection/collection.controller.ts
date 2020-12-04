import {
    Body,
    Controller, Delete,
    Get, HttpCode,
    HttpStatus, NotFoundException,
    Optional, Param, ParseArrayPipe, Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBody,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CollectionOutputDto } from './dto/collection.output.dto';
import { CollectionService } from './collection.service';
import {
    CollectionInputDto,
    CollectionUpdateDto,
} from './dto/collection.input.dto';
import { CheckInstitutionPipe } from './check-institution.pipe';

@Controller('collections')
@ApiTags('Collection')
export class CollectionController {
    constructor(private readonly collection: CollectionService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    @ApiQuery({ name: 'iid', required: false })
    async findAll(@Query('iid') @Optional() iid?: string): Promise<CollectionOutputDto[]> {
        let collections;

        if (iid) {
            collections = await this.collection.findByInstitution(iid);
        }
        else {
            collections = await this.collection.findAll();
        }

        return collections.map((c) => new CollectionOutputDto(c.toJSON()));
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: CollectionInputDto, isArray: true })
    async create(
        @Body(new ParseArrayPipe({ items: CollectionInputDto }), CheckInstitutionPipe)
        collectionData: CollectionInputDto[]): Promise<CollectionOutputDto[]> {

        const result = await this.collection.create(collectionData);
        return result.map((r) => new CollectionOutputDto(r.toJSON()));
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async findByID(@Param('id') id: string): Promise<CollectionOutputDto> {
        const collection = await this.collection.findByID(id);
        if (!collection) {
            throw new NotFoundException();
        }
        return new CollectionOutputDto(collection.toJSON());
    }

    @Patch(':id')
    async updateByID(
        @Param('id') id: string,
        @Body(CheckInstitutionPipe) collectionData: CollectionUpdateDto): Promise<CollectionOutputDto> {
        const collection = await this.collection.updateByID(id, collectionData);
        if (!collection) {
            throw new NotFoundException();
        }
        return new CollectionOutputDto(collection.toJSON());
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteByID(@Param('id') id: string): Promise<void> {
        const deleted = await this.collection.deleteByID(id);
        if (!deleted) {
            throw new NotFoundException();
        }
    }
}
