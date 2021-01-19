import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingComponent } from "./loading.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoadingService } from "./loading.service";


@NgModule({
    declarations: [
        LoadingComponent
    ],
    providers: [
        LoadingService
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule
    ],
    exports: [
        LoadingComponent
    ]
})
export class LoadingModule { }
