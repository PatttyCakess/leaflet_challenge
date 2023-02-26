const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"


// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  features = data.features;
  const eqCircles = []
  for (var i = 0; i < features.length; i++){
    coordinates = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]]
    eqCircles.push(
      L.circle(coordinates,{
      stroke: true,
      weight: 1,
      fillOpacity: 0.5,
      color: "black",
      fillColor: colorize(features[i].geometry.coordinates[2]),
      radius: markerSize(features[i].properties.mag)
      }).bindPopup(`<h3>${features[i].properties.place}</h3><hr><p>${new Date(features[i].properties.time)}</p><br><p>Magnitude: ${features[i].properties.mag}, Depth: ${features[i].geometry.coordinates[2]}</p>`)
  )};
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  

  // create earthquakes layer
  var earthquakes = L.layerGroup(eqCircles)

  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  var overlayMaps = {
    "earthquakes": earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  L.control.layers(baseMaps,overlayMaps,{
    collapsed: false
  }).addTo(myMap);

  // Create a legend to display information about our map.
  var info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend".
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");

    var legendInfo = "<h1>Earthquake Depth<br />(in km)</h1>" +
    "<div>"+
    "<ul class='legend-labels'>"+
      "<li><span style='background:#8DD3C7;'></span>-10-10</li>"+
      "<li><span style='background:#FFFFB3;'></span>10-30</li>"+
      "<li><span style='background:#BEBADA;'></span>30-50</li>"+
      "<li><span style='background:#FB8072;'></span>50-70</li>"+
      "<li><span style='background:#80B1D3;'></span>70-90</li>"+
      "<li><span style='background:#80B1D3;'></span>90+</li>"+
    "</ul>"+
    "</div>";

    div.innerHTML = legendInfo
    return div;
  };

  info.addTo(myMap);

});

function colorize(depth){
  var color = "";
  if (depth > 90){
    color = "red"
  }
  else if (depth > 70){
    color = "orange"
  }
  else if (depth > 50){
    color = "gold"
  }
  else if (depth > 30){
    color = "yellow"
  }
  else if (depth > 10){
    color = "greenyellow"
  }
  else{
    color = "lime"
  }
  return color
}

function markerSize(mag) {
  return Math.log(mag) *30000;
}

