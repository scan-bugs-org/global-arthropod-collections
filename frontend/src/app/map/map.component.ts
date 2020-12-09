import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.less'],
})
export class MapComponent implements OnInit {
    readonly LEAFLET_OPTS = {

    };

    constructor(private readonly collections: CollectionService) { }

    ngOnInit() {

    }
}
