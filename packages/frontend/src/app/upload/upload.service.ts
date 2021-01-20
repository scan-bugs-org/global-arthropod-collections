import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { FileUpload } from "./dto/file-upload.dto";
import { map, tap } from "rxjs/operators";
import { Exclude, Expose, plainToClass } from "class-transformer";
import { HeaderMappingResult } from "./dto/header-mapping-result.dto";
import { HeaderMappingInputInterface } from "@arthropodindex/common";
import { LoadingService } from "../alert/services/loading.service";

@Exclude()
class UploadID {
    @Expose()
    _id: string = '';
}

@Injectable()
export class UploadService {
    public UPLOADS_URL = Environment.uploadUrl;

    constructor(
        private readonly loading: LoadingService,
        private readonly http: HttpClient) { }

    uploadFile(csv: File): Observable<UploadID> {
        const form = new FormData();
        form.append('file', csv);

        return this.http.post(this.UPLOADS_URL, form).pipe(
            map((upload) => plainToClass(UploadID, upload))
        );
    }

    findByID(id: string): Observable<FileUpload> {
        return this.http.get(`${this.UPLOADS_URL}/${id}`).pipe(
            map((upload) => plainToClass(FileUpload, upload))
        );
    }

    mapUpload(id: string, mapping: HeaderMappingInputInterface): Observable<HeaderMappingResult> {
        return this.http.post(`${this.UPLOADS_URL}/${id}`, mapping).pipe(
            map((result) => plainToClass(HeaderMappingResult, result))
        );
    }
}
