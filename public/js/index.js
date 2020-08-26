const mapAttrib = `
  © <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> |
  © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> |
  <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong> |
  <a href="./edit/">Edit this map</a>
`;
// UPDATE THIS IN PRODUCTION
const mapboxToken = "pk.eyJ1IjoiZXZpbmR1bm4iLCJhIjoiY2thY3M3cXMwMWM4bzJ1cnliNnlkNHV2MiJ9.Twln5aH0wWGw9iKJoPE2Kg";
const mapboxTilesUrl = `https://tiles.bug-collections.org/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${mapboxToken}`;
const mapDataUrl = "./geojson";
const minZoom = 2;
const maxZoom = 16;

/**
 * Page's main function
 */
function main() {
  const map = loadMap();
  populateData(map, mapDataUrl);
}

function deepCopy(obj) {
  if (Array.isArray(obj)) {
    const arrCopy = [];
    obj.forEach((item) => {
      arrCopy.push(deepCopy(item));
    });
    return arrCopy;
  }

  if (obj instanceof Object) {
    const objCopy = {};
    Object.keys(obj).forEach((k) => {
      objCopy[k] = deepCopy(obj[k]);
    });
    return objCopy;
  }

  return obj;
}

/**
 * Loads open street map tiles into the map container
 * @return L.map
 */
function loadMap() {
  const map = L.map("map", {
    preferCanvas: true,
    bounceAtZoomLimits: false,
    inertia: false,
    center: [31, -20],
    zoom: 3
  });
  map.setMaxBounds([[-90, -180], [90, 180]]);
  const wikiTiles = new L.TileLayer(
    mapboxTilesUrl,
    { minZoom: minZoom, maxZoom: maxZoom, attribution: mapAttrib }
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
  const tiers = [
    L.layerGroup(),
    L.layerGroup(),
    L.layerGroup(),
    L.layerGroup()
  ];

  [1, 2, 3, 4].forEach((tier) => {
    fetch(`${geojsonUrl}?tier=${tier}`).then((geoData) => {
      return geoData.json();
    }).then((geojson) => {
      const tierLayer = L.geoJSON(geojson, {
        pointToLayer: doTooltip
      });
      tierLayer.addTo(map);
      tierLayer.eachLayer((point) => {
        point.setStyle(getMarkerStyle(map, point));
        tiers[tier - 1].addLayer(point);
      });

      // Auto-adjust marker size based on zoom level
      map.on("zoomend", () => {
        tierLayer.eachLayer((layer) => {
          layer.setRadius(getMarkerRadius(map, layer.feature));
        });
      });
    });
  });

  // Create a control for viewing by tier
  const tierControls = {
    "Tier 1": tiers[0],
    "Tier 2": tiers[1],
    "Tier 3": tiers[2],
    "Tier 4": tiers[3]
  };
  const tierControl = L.control.layers(null, tierControls).addTo(map);
  tierControl.expand();
  for (let i = 0; i < tierControl._layerControlInputs.length; i++) {
    tierControl._layerControlInputs[i].click();
  }

  // Create a control for scale
  L.control.scale().addTo(map);
}

/**
 * @param  {L.map}    map       Leaflet map
 * @param  {object}   feature   A GeoJSON point
 * @return {number}             Radius for the feature's marker based on
 *                              tier and zoom level
 */
function getMarkerRadius(map, feature) {
  const currentZoom = map.getZoom();
  let zoomComp = currentZoom / (minZoom + 1);

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
    fillColor: "#00336e",
    fillOpacity: 0.6,
    stroke: false,
    radius: getMarkerRadius(map, layer.feature),
    riseOnHover: true,
    riseOffset: 500,
    weight: 1
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
    let popupContent = '';

    if (feature.properties.url && feature.properties.url !== "NA") {
      popupContent += `<a target='_blank' href='${feature.properties.url}'>`;
    }
    popupContent += `<h3>${feature.properties.name}</h3>`;
    if (feature.properties.url && feature.properties.url !== '') {
      popupContent += "</a>";
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
