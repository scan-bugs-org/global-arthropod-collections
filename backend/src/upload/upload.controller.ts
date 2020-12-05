import {
    Controller,
    HttpCode, HttpStatus, Logger,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadOutputDto } from './dto/upload.output.dto';
import os from 'os';
import { UploadInputDto } from './dto/upload.input.dto';
import { CsvFileInterceptor, CsvFile } from './csv-file.interceptor';

@Controller('uploads')
@ApiTags('Upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('file', { dest: os.tmpdir() }),
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
}
