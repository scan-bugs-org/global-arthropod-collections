import { Controller, Get, HttpStatus, Optional, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CollectionOutputDto } from './dto/collection.output.dto';
import { CollectionService } from './collection.service';

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
}
