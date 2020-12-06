import { Inject, Injectable } from '@nestjs/common';
import {
    TMP_UPLOAD_PROVIDER_ID,
    TmpUpload,
} from '../database/models/TmpUpload';
import { Model } from 'mongoose';
import { HeaderMappingInputDto } from './dto/header-mapping.input.dto';
import { CsvFile } from './csv-file.interceptor';

@Injectable()
export class UploadService {
    constructor(
        @Inject(TMP_UPLOAD_PROVIDER_ID)
        private readonly upload: Model<TmpUpload>) { }

    async create(data: CsvFile): Promise<string> {
        const upload = await this.upload.create(data);
        return upload._id;
    }

    async findByID(id: string): Promise<TmpUpload> {
        return this.upload.findById(id).exec();
    }

    async deleteByID(id: string): Promise<boolean> {
        const result = await this.upload.deleteOne({ _id: id }).exec();
        return result.deletedCount === 1;
    }

    async mapUpload(mappings: HeaderMappingInputDto): Promise<boolean> {
        return true;
    }
}
