import {
    BadRequestException,
    Body,
    Controller,
    HttpCode, HttpStatus, Logger, NotFoundException, Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadOutputDto } from './dto/upload.output.dto';
import os from 'os';
import { UploadInputDto } from './dto/upload.input.dto';
import { CsvFileInterceptor, CsvFile } from './csv-file.interceptor';
import { HeaderMappingInputDto } from './dto/header-mapping.input.dto';
import { HeaderMappingOutputDto } from './dto/header-mapping.output.dto';
import { ObjectIdInterceptor } from '../common/object-id.interceptor';
import { MapUploadOutputDto } from './dto/map-upload.output.dto';

const FILE_UPLOAD_FIELD = 'file';
const FILE_TMP_DIR = os.tmpdir();

@Controller('uploads')
@ApiTags('Upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor(FILE_UPLOAD_FIELD, { dest: FILE_TMP_DIR }),
        CsvFileInterceptor
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadInputDto })
    @ApiResponse({ status: HttpStatus.OK, type: UploadOutputDto })
    @HttpCode(HttpStatus.OK)
    async upload(@UploadedFile() file: CsvFile): Promise<UploadOutputDto> {
        const uploadID = await this.uploadService.create(file);
        return new UploadOutputDto({ _id: uploadID, headers: file.headers });
    }

    @Post(':id/map')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: HeaderMappingInputDto })
    @ApiOkResponse({ type: HeaderMappingOutputDto })
    @UseInterceptors(ObjectIdInterceptor)
    async persistUpload(
        @Param('id') id: string,
        @Body() mappingData: HeaderMappingInputDto): Promise<MapUploadOutputDto> {

        const tmpUpload = await this.uploadService.findByID(id);
        if (!tmpUpload) {
            throw new NotFoundException();
        }

        return this.uploadService.mapUpload(tmpUpload, mappingData);
    }
}
