// Fetch earthquake data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(response => response.json())
  .then(data => {
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function getColor(depth) {
      // Implement a logic to return a color based on the depth value
      // Example: You can use a gradient from light to dark based on depth
      // Return a CSS color code like '#RRGGBB'
    }

    function getRadius(magnitude) {
      // Implement a logic to calculate the marker size based on magnitude
    }

    L.geoJSON(data.features, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(
          "Magnitude: " + feature.properties.mag +
          "<br>Depth: " + feature.geometry.coordinates[2] +
          "<br>Location: " + feature.properties.place
        );
      }
    }).addTo(map);

    // Add a legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      // Implement the legend content here
      return div;
    };
    legend.addTo(map);
  });