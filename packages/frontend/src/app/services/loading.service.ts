import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private readonly _isLoading = new BehaviorSubject<boolean>(false);
    isLoading$ = this._isLoading.asObservable().pipe(
        distinctUntilChanged(),
        shareReplay()
    );

    constructor() { }

    start() {
        this._isLoading.next(true);
    }

    end() {
        this._isLoading.next(false);
    }
}
