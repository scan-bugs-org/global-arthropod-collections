import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { DatabaseModule } from '../database/database.module';
import { CsvFileInterceptor } from './csv-file.interceptor';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        CommonModule,
        DatabaseModule
    ],
    providers: [UploadService, CsvFileInterceptor],
    controllers: [UploadController],
})
export class UploadModule { }
