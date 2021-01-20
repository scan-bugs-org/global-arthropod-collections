import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, timer } from "rxjs";
import {
    debounceTime,
    distinctUntilChanged,
    map,
    shareReplay
} from "rxjs/operators";

@Injectable()
export class LoadingService {
    private readonly _isLoading = new BehaviorSubject<number>(0);

    // Load for at least 500ms
    readonly isLoading = combineLatest([
        this._isLoading.asObservable().pipe(
            map((loadingCounter) => loadingCounter > 0),
            distinctUntilChanged()
        ),
        timer(500)
    ]).pipe(
        map((result) => result[0]),
        shareReplay(1)
    );

    constructor() { }

    start() {
        this._isLoading.next(this._isLoading.getValue() + 1);
    }

    end() {
        const currentValue = this._isLoading.getValue();

        if (currentValue > 0) {
            this._isLoading.next(currentValue - 1);
        }
    }
}
