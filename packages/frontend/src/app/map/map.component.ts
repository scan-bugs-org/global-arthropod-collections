import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { CircleMarker, LatLng, LayerGroup, tileLayer, Map, geoJSON, LatLngExpression, Point, Layer, GeoJSON, LatLngBounds } from 'leaflet';
import { CollectionGeoJson } from '../services/dto/collection-geojson.dto';
import { COLLECTION_ROUTE } from '../routes';
import { Environment } from '../../environments/environment';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.less'],
})
export class MapComponent {
    private static readonly MAP_ATTRIB = `
        © <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> |
        © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> |
        <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong> |
    `;

    private static readonly MAPBOX_TILES_URL = Environment.tilesUrl;

    private static readonly MIN_ZOOM = 2;
    private static readonly MAX_ZOOM = 16;
    private static readonly MAX_BOUNDS = new LatLngBounds([[-90, -180], [90, 180]]);

    private static readonly MARKER_STYLE = {
        fillColor: "#673ab7",
        fillOpacity: 0.6,
        stroke: false,
        riseOnHover: true,
        riseOffset: 500,
        weight: 1
    };

    public map: Map | null = null;

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

    onMapReady(map: Map) {
        this.map = map;
        this.map.setMaxBounds(MapComponent.MAX_BOUNDS);

        this.collections.collectionGeoJson(1).subscribe((colls) => {
            MapComponent.loadTier(map, colls);
        });

        this.collections.collectionGeoJson(2).subscribe((colls) => {
            MapComponent.loadTier(map, colls);
        });

        this.collections.collectionGeoJson(3).subscribe((colls) => {
            MapComponent.loadTier(map, colls);
        });

        this.collections.collectionGeoJson(4).subscribe((colls) => {
            MapComponent.loadTier(map, colls);
        });
    }

    private static loadTier(map: Map, collections: CollectionGeoJson[]) {
        collections.forEach((c) => {
            const layerGroup = geoJSON(c, { pointToLayer: MapComponent.doTooltip });
            layerGroup.eachLayer((layer) => {
                const style = Object.assign(
                    this.MARKER_STYLE,
                    // @ts-ignore
                    { radius: MapComponent.getMarkerRadius(map, layer.feature) }
                );
                // @ts-ignore
                layer.setStyle(style);
            });
            layerGroup.addTo(map);
        });
    }

    private static getMarkerRadius(map: Map, feature: any) {
        let zoomComp = map.getZoom() / (MapComponent.MIN_ZOOM + 1);

        switch (feature.properties.tier) {
            case 1:
                return 6 * zoomComp;
            case 2:
                return 5 * zoomComp;
            case 3:
                return 4.5 * zoomComp;
            case 4:
                return 3 * zoomComp;
            default:
                return 0;
        }
    }

    static doTooltip(feature: any, latLng: LatLng): CircleMarker {
        const marker = new CircleMarker(latLng);
        let popupContent = '';

        if (feature.properties.url && feature.properties.url !== "NA") {
            popupContent += `<a href='${COLLECTION_ROUTE}/${ feature.properties.id }'>`;
        }
        popupContent += `<h3>${ feature.properties.name }</h3>`;
        if (feature.properties.url && feature.properties.url !== '') {
            popupContent += "</a>";
        }

        marker.bindPopup(
            popupContent,
            { closeButton: false }
        );
        return marker;
    }
}
