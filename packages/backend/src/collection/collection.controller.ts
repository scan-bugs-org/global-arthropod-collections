import {
    Body,
    Controller, Delete,
    Get, HttpCode,
    HttpStatus, NotFoundException,
    Optional, Param, ParseArrayPipe, Patch,
    Post,
    Query, SerializeOptions, UseGuards, UseInterceptors
} from "@nestjs/common";
import {
    ApiBody, ApiExtraModels,
    ApiQuery,
    ApiResponse, ApiSecurity,
    ApiTags, getSchemaPath
} from "@nestjs/swagger";
import { CollectionOutputDto } from './dto/collection.output.dto';
import { CollectionService } from './collection.service';
import {
    CollectionInputDto,
    CollectionUpdateDto,
} from './dto/collection.input.dto';
import { CheckInstitutionPipe } from './check-institution.pipe';
import { ObjectIdInterceptor } from '../common/object-id.interceptor';
import { GeoJsonOutputDto } from './dto/geojson.output.dto';
import { Collection, GeoJsonCollection } from '../database/models/Collection';

const FindAllSchema = {
    oneOf: [
        { type: 'array', items: { $ref: getSchemaPath(CollectionOutputDto) } },
        { type: 'array', items: { $ref: getSchemaPath(GeoJsonOutputDto) } },
    ]
}

@Controller('collections')
@ApiTags('Collection')
@ApiExtraModels(CollectionOutputDto, GeoJsonOutputDto)
@UseInterceptors(ObjectIdInterceptor)
export class CollectionController {
    constructor(private readonly collection: CollectionService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, schema: FindAllSchema })
    @ApiQuery({ name: 'iid', required: false })
    @ApiQuery({ name: 'tier', type: Number, required: false })
    @ApiQuery({ name: 'geojson', type: Boolean, required: false })
    async findAll(
        @Query('iid') @Optional() iid?: string,
        @Query('tier') @Optional() tier?: number,
        @Query('geojson') @Optional() geojson?: boolean): Promise<CollectionOutputDto[] | GeoJsonOutputDto[]> {

        let collections = await this.collection.findAll({ iid, tier, geojson });

        if (geojson === true) {
            collections = collections as GeoJsonCollection[];
            return collections.map((c) => new GeoJsonOutputDto(c));
        }

        collections = collections as Collection[];
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
