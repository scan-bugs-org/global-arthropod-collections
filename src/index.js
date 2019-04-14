const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = "pk.eyJ1IjoiZXZpbmR1bm4iLCJhIjoiY2ptMWhoNDV3MTRtcjN2cnZiejc5MDZ6NiJ9.5kJNTKKD9-Y6KrU1Sf0rNw";

/**
 * Main function for the page
 */
function main() {
  let map = new mapboxgl.Map({
    container: "map",
    style: 'mapbox://styles/mapbox/outdoors-v10',
    center: [-111.7, 35.2],
    zoom: 10
  });
}

window.onload = main;
