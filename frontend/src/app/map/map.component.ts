import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { LatLng, tileLayer } from 'leaflet';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.less'],
})
export class MapComponent implements OnInit {
    private static readonly MAP_ATTRIB = `
        © <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> |
        © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> |
        <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong> |
    `;

    private static readonly MAPBOX_TOKEN = "pk.eyJ1IjoiZXZpbmR1bm4iLCJhIjoiY2thY3M3cXMwMWM4bzJ1cnliNnlkNHV2MiJ9.Twln5aH0wWGw9iKJoPE2Kg";
    private static readonly MAPBOX_TILES_URL = `https://tiles.bug-collections.org/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MapComponent.MAPBOX_TOKEN}`;

    private static readonly MIN_ZOOM = 2;
    private static readonly MAX_ZOOM = 16;

    readonly LEAFLET_OPTS = {
        preferCanvas: true,
        bounceAtZoomLimits: false,
        inertia: false,
        center: new LatLng(31, -20),
        zoom: 3,
        layers: [
            tileLayer(
                MapComponent.MAPBOX_TILES_URL,
                {
                    minZoom: MapComponent.MIN_ZOOM,
                    maxZoom: MapComponent.MAX_ZOOM,
                    attribution: MapComponent.MAP_ATTRIB
                }
            )
        ]
    };

    constructor(private readonly collections: CollectionService) { }

    ngOnInit() {

    }
}
