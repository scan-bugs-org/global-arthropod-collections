import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CollectionComponent } from "./collection/collection.component";
import { GoogleAuthModule } from "../google-auth/google-auth.module";
import { CollectionService } from "./collection.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CollectionEditorComponent } from './collection-editor/collection-editor.component';
import { CollectionListComponent } from './collection-list/collection-list.component';


@NgModule({
    declarations: [
        CollectionComponent,
        CollectionEditorComponent,
        CollectionListComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        GoogleAuthModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        RouterModule,
        HttpClientModule,
        MatIconModule,
        MatButtonModule
    ],
    providers: [
        CollectionService
    ],
    exports: [
        CollectionComponent
    ]
})
export class CollectionModule { }
