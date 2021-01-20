import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FormsModule } from "@angular/forms";
import { ExtendedModule } from "@angular/flex-layout";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { AlertModule } from "./alert/alert.module";
import { GoogleAuthModule } from "./google-auth/google-auth.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AlertModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        ExtendedModule,
        FormsModule,
        GoogleAuthModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatProgressSpinnerModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
