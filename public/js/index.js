mapboxgl.accessToken = "pk.eyJ1IjoiZXZpbmR1bm4iLCJhIjoiY2ptMWhoNDV3MTRtcjN2cnZiejc5MDZ6NiJ9.5kJNTKKD9-Y6KrU1Sf0rNw";

/**
 * Pulls the data at the given url & returns a promise for its responseText
 */
function pullData(url) {
  return new Promise((resolve, reject) => {
    let dataRequest = new XMLHttpRequest();
    dataRequest.open("GET", url, true);

    dataRequest.onload = () => {
      if (dataRequest.readyState == 4 && dataRequest.status == 200) {
        resolve(dataRequest.responseText);
      } else {
        reject(dataRequest.status, dataRequest.statusText);
      }
    };

    dataRequest.send();
  });
}

/**
 * Populates the map with the JSON data returned by pullData(/api/collections)
 */
function populateData(map, data) {
  let collections = JSON.parse(data);
  map.addLayer({
    id: "collections",
    type: "circle",
    source: {
      type: "geojson",
      data: collections
    },
    paint: {
      "circle-radius": {
        property: "tier",
        base: 2,
        stops: [
          [{ zoom: 1, value: 1 }, 0.5],
          [{ zoom: 1, value: 2 }, 1],
          [{ zoom: 1, value: 3 }, 1.5],
          [{ zoom: 2, value: 1 }, 3],
          [{ zoom: 2, value: 2 }, 4],
          [{ zoom: 2, value: 3 }, 5],
          [{ zoom: 8, value: 1 }, 12],
          [{ zoom: 8, value: 2 }, 16],
          [{ zoom: 8, value: 3 }, 20]
        ]
      },
      "circle-color": {
        type: "exponential",
        property: "tier",
        stops: [
          [1, "rgba(255, 150, 0, 0.75)"],
          [2, "rgba(255, 75, 0, 0.75)"],
          [3, "rgba(255, 0, 0, 0.75)"],
        ]
      }
    }
  });

  let popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on("mouseenter", "collections", (event) => {
    map.getCanvas().style.cursor = "pointer";

    let coordinates = event.features[0].geometry.coordinates.slice();
    let collectionName = event.features[0].properties.collectionName;

    if (collectionName == "null") {
      collectionName = "Unnamed Collection";
    }

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates)
      .setHTML("<h1>" + collectionName + "</h1>")
      .addTo(map);
  });

  map.on("mouseleave", "collections", (event) => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
}

/**
 * Page's main function
 */
function main() {
  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/outdoors-v11",
    center: [-90, 45],
    zoom: 2
  });

  map.on("load", () => {
    pullData("/api/collections?geojson=true")
      .then((response) => {
        populateData(map, response);
      })
      .catch((statusCode, statusText) => {
        console.error("Error pulling data: (" + statusCode + ") " + statusText);
      });
  });
}

window.onload = main;
