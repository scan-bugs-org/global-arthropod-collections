export class CommonEnvironment {
    static production = false;
    static apiUrl = "http://127.0.0.1:8080/api/v1";
    static mapboxToken = 'pk.eyJ1IjoiZXZpbmR1bm4iLCJhIjoiY2thY3M3cXMwMWM4bzJ1cnliNnlkNHV2MiJ9.Twln5aH0wWGw9iKJoPE2Kg';

    static tilesUrl = `https://tiles.bug-collections.org/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${CommonEnvironment.mapboxToken}`;
    static institutionUrl = `${CommonEnvironment.apiUrl}/institutions`;
    static collectionUrl = `${CommonEnvironment.apiUrl}/collections`;
}
