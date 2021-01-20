import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
    MAT_SNACK_BAR_DEFAULT_OPTIONS,
    MatSnackBarModule
} from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AlertService } from "./services/alert.service";
import { LoadingService } from "./services/loading.service";


@NgModule({
    providers: [
        AlertService,
        LoadingService,
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: { duration: 2000 }
        }
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ]
})
export class AlertModule { }
