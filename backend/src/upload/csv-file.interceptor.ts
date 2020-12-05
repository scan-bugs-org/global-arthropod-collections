import {
    Injectable,
    ExecutionContext, NestInterceptor, CallHandler, BadRequestException,
} from '@nestjs/common';
import { Express } from 'express';
import path from "path";
import { Observable } from 'rxjs';

type MulterFile = Express.Multer.File;

@Injectable()
export class CsvFileInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const file: MulterFile = request.file;

        const originalFile = path.basename(file.originalname);
        const extCorrect = path.extname(originalFile) === '.csv';
        const mimeTypeCorrect = file.mimetype.startsWith('text/csv');

        if (extCorrect && mimeTypeCorrect) {
            return next.handle();
        }
        else {
            throw new BadRequestException(`${originalFile} is not a CSV`);
        }
    }
}
