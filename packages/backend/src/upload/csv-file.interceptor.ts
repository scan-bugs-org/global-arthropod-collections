import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor
} from "@nestjs/common";
import { Express } from "express";
import path from "path";
import csvParser from "csv-parser";
import fs from "fs";

const fsPromises = fs.promises;
type MulterFile = Express.Multer.File;
export type CsvFile = { headers: string[], data: Record<string, unknown>[] }

@Injectable()
export class CsvFileInterceptor implements NestInterceptor {
    private readonly logger = new Logger(CsvFileInterceptor.name);

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
        const request = context.switchToHttp().getRequest();
        const file: MulterFile = request.file;

        const originalFile = path.basename(file.originalname);
        const extCorrect = path.extname(originalFile) === '.csv';
        const mimeTypeCorrect = file.mimetype.startsWith('text/csv');
        const badRequest = new BadRequestException(`${originalFile} is not a CSV`);

        if (extCorrect && mimeTypeCorrect) {
            try {
                request.file = await CsvFileInterceptor.parseCsv(file.path);
            }
            catch (e) {
                throw badRequest;
            }

            try {
                await fsPromises.unlink(file.path);
            }
            catch (e) {
                this.logger.error(`Error deleting ${file.path}`);
            }
            return next.handle();
        }
        else {
            throw badRequest;
        }
    }

    static async parseCsv(filePath): Promise<CsvFile> {
        return new Promise(((resolve, reject) => {
            let headers: string[] = [];
            const data = [];

            fs.createReadStream(filePath).pipe(csvParser())
                .on('headers', (fileHeaders) => {
                    headers = fileHeaders
                })
                .on('data', (row) => data.push(row))
                .on('end', () => resolve({ headers, data }))
                .on('error', (e) => reject(e));
        }));
    }
}
