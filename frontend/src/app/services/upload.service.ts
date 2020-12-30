import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UploadService {

    constructor(private readonly http: HttpClient) { }

    doUpload(csv: File) {

    }
}
