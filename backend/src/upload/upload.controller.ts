import {
    Body,
    Controller,
    HttpCode, HttpStatus, Logger, Param,
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
    async persistUpload(
        @Param('id') id: string,
        @Body('headerMap') headerMap: HeaderMappingInputDto): Promise<HeaderMappingOutputDto> {

        const uploadKeys: string[] = Object.keys(headerMap);
        const tmpUpload = await this.uploadService.findByID(id);



        return null;
    }
}
