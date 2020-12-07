import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { CollectionListItem } from '../../services/dto/collection-list-item.dto';
import { Sort } from '@angular/material/sort';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-collection-tab',
    templateUrl: './collection-tab.component.html',
    styleUrls: ['./collection-tab.component.less'],
})
export class CollectionTabComponent implements OnInit {
    public collections: CollectionListItem[] = [];

    constructor(
        private readonly alert: AlertService,
        private readonly collectionService: CollectionService) { }

    get displayedColumns(): string[] {
        if (this.collections.length > 0) {
            return [...Object.keys(this.collections[0]), "delete"];
        }
        return [];
    }

    ngOnInit(): void {
        this.loadCollections();
    }

    loadCollections(): void {
        this.collectionService.collectionList().subscribe((collections) => {
            this.collections = collections;
        });
    }

    onSort(sort: Sort) {
        if (!sort.active || sort.direction === '') {
            return;
        }

        const collections = this.collections.slice();
        const sortAscending = sort.direction === 'asc';

        this.collections = collections.sort((a, b) => {
            let aField;
            let bField;

            switch (sort.active) {
                case '_id':
                    aField = a._id;
                    bField = b._id;
                    break;
                // @ts-ignore
                case 'institution':
                    if (a.institution && b.institution) {
                        aField = a.institution.name;
                        bField = b.institution.name;
                        break;
                    }
                default:
                    aField = a.name;
                    bField = b.name;
            }

            return CollectionTabComponent.sortStrings(
                aField,
                bField,
                sortAscending
            );
        })
    }

    deleteCollection(id: string) {
        this.collectionService.deleteByID(id).subscribe((success) => {
            if (success) {
                this.alert.showMessage('Collection deleted successfully');
            }
            else {
                this.alert.showError('Error deleting collection');
            }
            this.loadCollections();
        });
    }

    // TODO: This is duplicated in both tabs
    private static sortStrings(a: string, b: string, asc = false): number {
        return asc ? b.localeCompare(a) : a.localeCompare(b);
    }
}
