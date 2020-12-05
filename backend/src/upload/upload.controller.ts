import {
    BadRequestException, Body,
    Controller,
    Get, HttpCode, HttpStatus, Logger,
    Post,
    UploadedFile, UseGuards,
    UseInterceptors, UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadOutputDto } from './dto/upload.output.dto';
import os from 'os';
import { UploadInputDto } from './dto/upload.input.dto';
import { Express } from 'express';
import { CsvFileInterceptor } from './csv-file.interceptor';
import fs from 'fs';

const fsPromises = fs.promises;
type MulterFile = Express.Multer.File;

@Controller('uploads')
@ApiTags('Upload')
export class UploadController {
    private readonly logger = new Logger(UploadController.name);

    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('file', { dest: os.tmpdir() }),
        CsvFileInterceptor
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadInputDto })
    @HttpCode(HttpStatus.OK)
    async upload(@UploadedFile() file: MulterFile): Promise<UploadOutputDto> {

        try {
            await fsPromises.unlink(file.path);
        }
        catch (e) {
            this.logger.error(`Error removing uploaded file: ${e.message}`)
        }

        return null;
    }
}
