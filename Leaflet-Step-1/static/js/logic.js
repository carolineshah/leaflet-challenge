// M2.5+ earthquakes past 7 days link
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// perform get request
d3.json(queryUrl).then(function (data) {
    console.log(data.features);

    // pass off to our createMap function
    createMap(data.features);
  });

function createMap(data) {

    let markers = [];
    for (var i = 0; i < data.length; i++) {
        // get indv variables
        let lat = data[i].geometry.coordinates[1];
        let lon = data[i].geometry.coordinates[0];
        let depth = data[i].geometry.coordinates[2];
        let mag = data[i].properties.mag;

        // use depth to determien color of circle
        let color = "#FF0D0D";
        if (depth <= 10) {
            color = "#69B34C"
        } else if (depth <= 30) {
            color = '#ACB334'
        } else if (depth <= 50) {
            color = '#FAB733'
        } else if (depth <= 70) {
            color = '#FF8E15'
        } else if (depth <= 90) {
            color = '#FF4E11'
        } else {
            color = '#FF0D0D'
        };
        // push markers into list
        markers.push(L.circle([lat, lon], {
            color: 'black',
            opacity: 0.3,
            stroke: true,
            fillOpacity: 0.6,
            fillColor: color,
            radius: mag*20000
        }).bindPopup(`${data[i].properties.place}`));
    };


    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Street Map": street
    };
    let markerLayer = L.layerGroup(markers);
    let overlaysMaps = {
        earthquakes: markerLayer
    };


    let myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [street, markerLayer]
    });

    L.control.layers(baseMaps, overlaysMaps, {
        collapsed: false
    }).addTo(myMap);

    // add legend
    let legend = L.control({
        position: "bottomright"
    });
      
    
    // When the layer control is added, insert a div with the class of "legend".
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
    
        // grades and colors
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = [
          "#69B34C",
          "#ACB334",
          "#FAB733",
          "#FF8E15",
          "#FF4E11",
          "#FF0D0D"
        ];
    
        // loop through and add color block and interval
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
          + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }

        return div;
      };

    // Add the info legend to the map.
    legend.addTo(myMap);


}; 
