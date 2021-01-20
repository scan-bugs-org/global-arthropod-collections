import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class AlertService {
    constructor(private readonly snackBar: MatSnackBar) {
    }

    showMessage(message: string): void {
        this.snackBar.open(message);
    }

    showError(message: string): void {
        this.snackBar.open(message, "", { panelClass: "snackbar-error" });
    }
}
