import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { CollectionTabComponent } from './resource-list/collection-tab/collection-tab.component';
import { InstitutionTabComponent } from './resource-list/institution-tab/institution-tab.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { InstitutionComponent } from './institution/institution.component';
import { MatSortModule } from '@angular/material/sort';
import { CollectionComponent } from './collection/collection.component';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { UploadComponent } from './csv-upload/upload.component';
import { FileUploaderComponent } from './csv-upload/file-uploader/file-uploader.component';
import { UploadMapperComponent } from "./upload-mapper/upload-mapper.component";
import { MatSelectModule } from '@angular/material/select';
import { ExtendedModule } from "@angular/flex-layout";
import { MatMenuModule } from "@angular/material/menu";
import { GoogleAuthModule } from "./google-auth/google-auth.module";
import { LoadingModule } from "./loading/loading.module";

@NgModule({
    declarations: [
        AppComponent,
        ResourceListComponent,
        CollectionTabComponent,
        InstitutionTabComponent,
        InstitutionComponent,
        CollectionComponent,
        MapComponent,
        UploadComponent,
        FileUploaderComponent,
        UploadMapperComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatTabsModule,
        MatTableModule,
        HttpClientModule,
        MatIconModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatListModule,
        MatButtonModule,
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        LeafletModule,
        MatSelectModule,
        ExtendedModule,
        GoogleAuthModule,
        LoadingModule
    ],
    providers: [
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: { duration: 2000 }
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
