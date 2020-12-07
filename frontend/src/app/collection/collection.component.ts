import { Component, OnInit } from '@angular/core';
import { CollectionListItem } from '../services/dto/collection-list-item.dto';
import { CollectionService } from '../services/collection.service';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.less'],
})
export class CollectionComponent implements OnInit {
    public collections: CollectionListItem[] = [];

    constructor(private readonly collectionService: CollectionService) { }

    ngOnInit(): void {
        this.collectionService.collectionList().subscribe((collections) => {
            this.collections = collections;
        });
    }
}
