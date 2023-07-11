// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

  function createFeatures(earthquakeData) {  
// Give each feature a popup of the earthquake's magnitude and location.
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}<h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>${feature.properties.mag}</p>`)
};




// Create a GeoJSON layer containing the features array on the earthquakeData object.
function createCircleMarker(feature, coord) {
   let options = {
    radius: feature.properties.mag * 5,
    fillColor: getColor(feature.properties.mag),
    color: "grey",
    weight: .7,
    opacity: 1,
   } 
   return L.circleMarker(coord, options);
};
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
});

// Sending our earthquakes layer to the createMap function.
createMap(earthquakes);

  };

// Depth color function

    // Select the color of the circle based on the 
    // depth of the earthquake
    
    /*function getColor(depth) {
        if (depth < 90) {
            return "#ff8000";
        }
        else if (depth < 70) {
            return "#ffbf00";
        }
        else if (depth < 50) {
            return "#ffff00";
        }
        else if (depth < 30) {
            return "#bfff00";
        }
        else if (depth < 10) {
            return "#80ff00";
        }
        else {
            return "#ff4000";
        }
    };*/

    function getColor(depth) {
        switch (true) {
        case depth > 90:
          return "#e92684";
        case depth > 70: 
          return "#e95d26"; 
        case depth > 50:
          return "#ee9c00";
        case depth > 30:
          return "#eecc00";
        case depth > 10:
          return "#d4ee00";
        default:
          return "#98ee00";
        }
      }




// Create the map
function createMap(earthquakes) {

    // Create the base layers.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
        maxZoom: 20,
        zoomOffset: -1
  })
    let darkmap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 20,
    
  });

    // Define a baseMaps object to hold our base layers
    let baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
        };
    
        // Create overlay object to hold our overlay layer
        let overlayMaps = {
            Earthquakes: earthquakes
        };
    
        // Create our map, giving it the streetmap and earthquakes layers to display on load
        let myMap = L.map("map", {
            center: [
                37.09, -95.71
            ],
            zoom: 5,
            layers: [streetmap, earthquakes]
        });
    
        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);
    

        //legend.addTo(myMap);
    
        //createLegend();

        var myColors = ["#e92684", "#e95d26", "#ee9c00", "#eecc00", "#d4ee00", "#98ee00"];
    // https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        labels = ["<div style='background-color: lightgray'><strong>&nbsp&nbspDepth (km)&nbsp&nbsp</strong></div>"];
        categories = ['+90', ' 70-90', ' 50-70', ' 30-50', ' 10-30', '-10-10'];
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
                labels.push(
                    '<li class="circle" style="background-color:' + myColors[i] + '">' + categories[i] + '</li> '
                );
        }
        div.innerHTML = '<ul style="list-style-type:none; text-align: center">' + labels.join('') + '</ul>'
        return div;
    };
    legend.addTo(myMap);
    };
   
