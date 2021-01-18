export class CommonEnvironment {
    static production = false;
    static apiUrl = "http://127.0.0.1:8080/api/v1";
    static mapboxToken = 'pk.eyJ1IjoiZXZpbmR1bm4iLCJhIjoiY2thY3J2bTdiMDNhdzJ5cXc2c2w2NWJlaCJ9.7vnANHAtTNT2eqhwWexOKQ';
    static googleClientID = '521380041689-4u71agptvh31dhq495kuk5aaa5ffl28h.apps.googleusercontent.com';

    static get tilesUrl() {
        return `http://127.0.0.1:8082/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${this.mapboxToken}`;
    }

    static get institutionUrl() {
        return `${this.apiUrl}/institutions`;
    }

    static get collectionUrl() {
        return `${this.apiUrl}/collections`;
    }

    static get uploadUrl() {
        return `${this.apiUrl}/uploads`;
    }

    static get loginUrl() {
        return `${this.apiUrl}/login`;
    }
}
