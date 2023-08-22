// Using d3.json to fetch earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
  let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
  });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

      attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    const maxDepth = 700; // Maximum recorded depth (adjust as needed)

    function getColor(depth) {
      const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([maxDepth, 0]);
      
      return colorScale(depth);
    }

    function getRadius(magnitude) {
      const scalingFactor = 5;
      return Math.max(4, magnitude * scalingFactor);
    }

    L.geoJSON(data.features, {
      pointToLayer: function(feature, latlng) {
        const coordinates = feature.geometry.coordinates;
        const longitude = parseFloat(coordinates[0]);
        const latitude = parseFloat(coordinates[1]);
        const depth = parseFloat(coordinates[2]);
        const mag = feature.properties.mag || 0;
        
        return L.circleMarker(L.latLng(latitude, longitude), {
          radius: getRadius(mag),
          fillColor: getColor(depth),
          // border colors
          color: "#000",
          weight: 1,
          fillOpacity: 0.8

          //binding popup to each layer
        }).bindPopup(
          "Magnitude: " + mag +
          "<br>Depth: " + depth +
          "<br>Location: " + feature.properties.place
        );
      }
    }).addTo(myMap);

    // setting up legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (myMap) {
    const div = L.DomUtil.create('div', 'info legend');
    const numGrades = 5; // Number of gradient steps
// continued.. legend 
  div.innerHTML += '<h4>Depth Legend</h4>';
  for (let i = 0; i < numGrades; i++) {
    const depthValue = maxDepth / numGrades * (i + 1);
    const color = getColor(depthValue);
    div.innerHTML +=
      '<i style="background:' + color + '"></i> ' +
      depthValue.toFixed(2) + ' km<br>';
  }

      return div;
    };
    legend.addTo(myMap);
  });
