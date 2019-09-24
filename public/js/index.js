const wikiMediaAttrib = `
    <a href=\"https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use\">
        Wikimedia Maps
    </a> | Map data © 
    <a href=\"https://openstreetmap.org/copyright\">
        OpenStreetMap
    </a> contributors
`;
const wikimediaTilesURL = "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png";
const mapDataUrl = "data/collections.geojson";
const minZoom = 3;

/**
 * Page's main function
 */
function main() {
  const map = loadMap();
  map.setView([39.8, -98.6], 4);
  populateData(map, mapDataUrl);
}

/**
 * Loads open street map tiles into the map container
 * @return L.map
 */
function loadMap() {
  const map = L.map("map");
  const wikiTiles = new L.TileLayer(
    wikimediaTilesURL,
    { minZoom: minZoom, maxZoom: 10, attribution: wikiMediaAttrib }
  );

  map.addLayer(wikiTiles);
  return map;
}

/**
 * Populates the map collection data
 * @param  {L.map}      map         Leaflet map object
 * @param  {string}     geojsonUrl  Location of the GeoJSON data
 */
function populateData(map, geojsonUrl) {
  fetch(geojsonUrl)
    .then((geojsonData) => {
      return geojsonData.json();
    })
    .then((geojson) => {
      const pointLayer = L.geoJSON(
        geojson,
        {
          pointToLayer: doTooltip
        }
      );
      pointLayer.addTo(map);

      const tierOne = L.layerGroup();
      const tierTwo = L.layerGroup();
      const tierThree = L.layerGroup();
      const tierFour = L.layerGroup();

      pointLayer.eachLayer((layer) => {
        // Set the marker style
        layer.setStyle(getMarkerStyle(map, layer));

        // Create a layer for each tier
        switch (layer.feature.properties.tier) {
          case 2:
            tierTwo.addLayer(layer);
            break;
          case 3:
            tierThree.addLayer(layer);
            break;
          case 4:
            tierFour.addLayer(layer);
            break;
          default:
            tierOne.addLayer(layer);
        }
      });

      // Create a control for viewing by tier
      const tiers = {
        "Tier 1": tierOne,
        "Tier 2": tierTwo,
        "Tier 3": tierThree,
        "Tier 4": tierFour
      };
      const tierControl = L.control.layers(null, tiers).addTo(map);
      tierControl.expand();
      for (let i = 0; i < tierControl._layerControlInputs.length; i++) {
        tierControl._layerControlInputs[i].click();
      }

      // Create a control for scale
      L.control.scale().addTo(map);

      // Auto-adjust marker size based on zoom level
      map.on("zoomend", () => {
        pointLayer.eachLayer((layer) => {
          layer.setRadius(getMarkerRadius(map, layer.feature));
        });
      });
    });
}

/**
 * @param  {L.map}    map       Leaflet map
 * @param  {object}   feature   A GeoJSON point
 * @return {number}             Radius for the feature's marker based on
 *                              tier and zoom level
 */
function getMarkerRadius(map, feature) {
  const currentZoom = map.getZoom();
  let zoomComp = currentZoom / minZoom;

  if (feature.properties.tier) {
    if (feature.properties.tier === 1) {
      return 5 * zoomComp;
    } else if (feature.properties.tier === 2) {
      return 4 * zoomComp;
    } else if (feature.properties.tier === 3) {
      return 3.5 * zoomComp;
    } else if (feature.properties.tier === 4) {
      return 3 * zoomComp;
    }
  }

  // Default, if tier isn't available
  return 3 * zoomComp;
}

/**
 * @param  {L.map}            map     Leaflet map
 * @param  {L.circleMarker}   layer   circleMarker layer
 * @return {object}                   Style for the circleMarker based on
 *                                    tier of the underlying GeoJSON feature
 *                                    and zoom level
 */
function getMarkerStyle(map, layer) {
  return {
    fillColor: "darkgreen",
    fillOpacity: 0.6,
    stroke: false,
    radius: getMarkerRadius(map, layer.feature),
    riseOnHover: true,
    riseOffset: 500
  };
}

/**
 * Populate the markers & corresponding tooltips for each geojson collection
 * @param  {Object} feature GeoJSON feature representing the collection
 * @param  {Array<number>} latLng  [lat, lon]
 * @return {L.circleMarker}       Leaflet circle marker for the geojson point
 */
function doTooltip(feature, latLng) {
  const marker = L.circleMarker(latLng, null);
    let popupContent = (
      "<h3>" + feature.properties.institutionName + "</h3>" +
      "<a target='_blank' href='" + feature.properties.url + "'>" +
        "<h4>" + feature.properties.collectionName + "</h4>" +
      "</a>"
    );

    if (!feature.properties.url) {
      popupContent = (
        "<h3>" + feature.properties.institutionName + "</h3>" +
        "<h4>" + feature.properties.collectionName + "</h4>"
      );
    }

    marker.bindPopup(
      popupContent,
      { closeButton: false }
    );
  return marker;
}

window.onload = () => {
  main();
};
