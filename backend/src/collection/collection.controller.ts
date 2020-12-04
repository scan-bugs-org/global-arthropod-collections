import {
    Body,
    Controller,
    Get, HttpCode,
    HttpStatus,
    Optional, ParseArrayPipe,
    Post,
    Query, UsePipes,
} from '@nestjs/common';
import {
    ApiBody,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CollectionOutputDto } from './dto/collection.output.dto';
import { CollectionService } from './collection.service';
import { CollectionInputDto } from './dto/collection.input.dto';
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
}
