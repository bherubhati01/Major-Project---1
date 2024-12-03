// mapboxgl.accessToken = MapToken;

// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     center: [coordinates], // starting position [lng, lat]. Note that lat must be set between -90 and 90
//     zoom: 9 // starting zoom
// });


// console.log(coordinates)
// // //Create a new marker.
// const marker = new mapboxgl.Marker()
//     .setLngLat([coordinates])
//     .addTo(map);

if (coordinates.length == 0){
    coordinates = [75.7873,26.9124]
} 
maptilersdk.config.apiKey = 'ycV99v98AW7SLuHN044s';
    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element in which the SDK will render the map
      style: maptilersdk.MapStyle.STREETS,
      center: coordinates, // starting position [lng, lat]
      zoom: 8 // starting zoom
    });

    const marker = new maptilersdk.Marker()
  .setLngLat(coordinates)
  .addTo(map);

