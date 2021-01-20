import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { LoadingService } from "./services/loading.service";

@Component({
    selector: "app-loading",
    templateUrl: "./loading.component.html",
    styleUrls: ["./loading.component.less"]
})
export class LoadingComponent implements OnInit {
    isLoading = false;

    constructor(
        private readonly loadingService: LoadingService) { }

    ngOnInit(): void {
        this.loadingService.isLoading.subscribe((isLoading) => {
            this.isLoading = isLoading;
        });
    }
}
