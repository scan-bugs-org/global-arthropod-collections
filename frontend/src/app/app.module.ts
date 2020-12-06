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

@NgModule({
    declarations: [
        AppComponent,
        ResourceListComponent,
        CollectionTabComponent,
        InstitutionTabComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatTabsModule,
        MatTableModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
