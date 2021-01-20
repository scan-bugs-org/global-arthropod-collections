import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UploadMapperComponent } from "./upload-mapper/upload-mapper.component";
import { UploadService } from "./upload.service";
import { UploadComponent } from "./upload.component";
import { FileUploaderComponent } from "./file-uploader/file-uploader.component";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { AlertModule } from "../alert/alert.module";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";


@NgModule({
    declarations: [
        UploadComponent,
        FileUploaderComponent,
        UploadMapperComponent
    ],
    imports: [
        AlertModule,
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatTableModule,
        ReactiveFormsModule,
    ],
    providers: [
        UploadService
    ],
    exports: [
        UploadComponent,
        UploadMapperComponent
    ]
})
export class UploadModule { }
