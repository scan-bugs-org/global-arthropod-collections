import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapComponent } from "./map.component";
import { CollectionModule } from "../collection/collection.module";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";


@NgModule({
    declarations: [
        MapComponent
    ],
    imports: [
        CommonModule,
        CollectionModule,
        LeafletModule,
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule
    ],
    exports: [
        MapComponent
    ]
})
export class MapModule { }
