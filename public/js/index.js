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
  collections.forEach((collection) => {
    let newPoint = document.createElement("div");
    newPoint.className = "marker";

    let popup = new mapboxgl.Popup({ offset: 25 });

    if (collection["collectionName"] != null) {
      popup.setHTML("<h3>" + collection["collectionName"] + "</h3>");
    }

    new mapboxgl.Marker(newPoint)
      .setLngLat({ lng: collection["lon"], lat: collection["lat"] })
      .setPopup(popup)
      .addTo(map);
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

  pullData("/api/collections?columns=collectionName,lat,lon")
    .then((response) => {
      populateData(map, response);
    })
    .catch((statusCode, statusText) => {
      console.error("Error pulling data: (" + statusCode + ") " + statusText);
    });
}

window.onload = main;
