import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';

@Component({
    selector: 'app-resource-list',
    templateUrl: './resource-list.component.html',
    styleUrls: ['./resource-list.component.less'],
})
export class ResourceListComponent implements OnInit {
    private static readonly DEFAULT_TAB = 0;

    public LABEL_COLLECTIONS = "Collections";
    public LABEL_INSTITUTIONS = "Institutions";

    public selectedIndex: number = ResourceListComponent.DEFAULT_TAB;

    constructor(
        private readonly currentRoute: ActivatedRoute,
        private readonly router: Router) { }

    ngOnInit(): void {
        this.currentRoute.queryParamMap.subscribe((params) => {
            if (params.has('tab')) {
                this.selectedIndex = parseInt(params.get('tab') as string);
            }
            else {
                this.selectedIndex = ResourceListComponent.DEFAULT_TAB;
            }
        });
    }

    onTabChanged(tabIndex: number) {
        const navParams: NavigationExtras = {
            relativeTo: this.currentRoute,
            queryParams: {}
        };

        if (tabIndex !== ResourceListComponent.DEFAULT_TAB) {
            const params = navParams.queryParams as Params;
            params.tab = tabIndex;
        }

        this.router.navigate([], navParams);
    }
}
