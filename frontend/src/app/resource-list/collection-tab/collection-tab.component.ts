import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { CollectionListItem } from '../../services/dto/collection-list-item.dto';

@Component({
    selector: 'app-collection-tab',
    templateUrl: './collection-tab.component.html',
    styleUrls: ['./collection-tab.component.less'],
})
export class CollectionTabComponent implements OnInit {
    public collections: CollectionListItem[] = [];

    constructor(private readonly collectionService: CollectionService) { }

    ngOnInit(): void {
        this.collectionService.collectionList().subscribe((collections) => {
            this.collections = collections;
        });
    }
}
