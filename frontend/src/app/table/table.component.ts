import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.less'],
})
export class TableComponent {
    @Input()
    dataSource: Record<string, unknown>[] = [];

    @Output()
    onDeleteRow = new EventEmitter<Record<string, unknown>>();

    public get displayedColumns() {
        return Object.keys(this.dataSource[0]);
    }

    constructor() { }

    onSort(sort: Sort) {
        if (!sort.active || sort.direction === '') {
            return;
        }

        const sortColumn = sort.active;
        const ascending = sort.direction === 'asc';

        const dataSource = this.dataSource.slice();
        this.dataSource = dataSource.sort((a, b) => {
            return TableComponent.sortStrings(
                (a[sortColumn] as any).toString(),
                (b[sortColumn] as any).toString(),
                ascending
            );
        });
    }

    private static sortStrings(a: string, b: string, asc = false): number {
        return asc ? b.localeCompare(a) : a.localeCompare(b);
    }
}
