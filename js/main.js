// Add event listeners for splash screen
document.addEventListener('DOMContentLoaded', function () {
    const splashScreen = document.getElementById('splash-screen');
    const closeButton = document.getElementById('close-splash');
    
    // Add event listener to close the splash screen when clicked
    closeButton.addEventListener('click', function () {
        splashScreen.style.display = 'none';
    });
});


// Instantiate the Leaflet map
const map = L.map('map', {
    center: [44, -120],
    zoom: 7,
    zoomControl: false // Disable default zoom in/out buttons 
});
                 
                 
// Add new zoom in/out buttons with home button
var zoomHome = L.Control.zoomHome();
zoomHome.addTo(map);      
                
   
// Add CartoDB Positron basemap
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);


// Add OSM base tilelayer
var OSM = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
});


// Add Esri World Shaded Relief basemap
var Esri_WorldShadedRelief = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
	maxZoom: 13
});


// Add Esri World Imagery basemap
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


// Create a basemap control layer
var basemaps = {
    "CartoDB Positron": CartoDB_Positron,  
    "Open Street Map": OSM,  
    "Esri World Shaded Relief": Esri_WorldShadedRelief,
    "Esri World Imagery": Esri_WorldImagery
};


L.control.layers(basemaps).addTo(map);


// Create cluster group for Landslides
const ConfidenceCluster = new L.MarkerClusterGroup().addTo(map);


// Marker styling for Landslides
function ConfidenceMarker(feature, latlng) {
    return L.circleMarker(latlng, { color: '#b39262'});
}


// Loading data with filter and popup functions
function loadData(clusterGroup, geoJSONPath, filterFunction, popupFunction, markerFunction) {
    fetch(geoJSONPath)
        .then(response => response.json())
        .then(data => {
            clusterGroup.clearLayers();
            L.geoJSON(data, {
                filter: filterFunction,
                onEachFeature: popupFunction,
                pointToLayer: markerFunction
            }).addTo(clusterGroup);
        });
}


// Filtering function for Landslides
function ConfidenceFilter(feature) {
    const selectedConfidence = document.getElementById('ConfidenceType').value;
    if (selectedConfidence === 'all') return true;
    return feature.properties.Confidence === selectedConfidence;
}


// Popup function for Landslides
function ConfidencePopup(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(
            `<p><strong>${feature.properties.State.toUpperCase()}</strong><br>
            <strong>Year:</strong> ${feature.properties.Year}<br>
            <strong>Notes:</strong> ${feature.properties.Notes}</p>`
        );
    }
}


// Event listeners for checkboxes and filters
document.getElementById('Confidence').addEventListener('change', function() {
    if (this.checked) {
        map.addLayer(ConfidenceCluster);
    } else {
        map.removeLayer(ConfidenceCluster);
    }
    Legend();
});


document.getElementById('MLRA').addEventListener('change', function() {
    if (this.checked) {
        map.addLayer(MLRA);
    } else {
        map.removeLayer(MLRA);
    }
    Legend();
});


document.getElementById('ConfidenceType').addEventListener('change', function() {
    loadData(ConfidenceCluster, 'data/Landslides_Oregon.geojson', ConfidenceFilter, ConfidencePopup, ConfidenceMarker);
});


// Load landlside data on page load
loadData(ConfidenceCluster, 'data/Landslides_Oregon.geojson', ConfidenceFilter, ConfidencePopup, ConfidenceMarker);


// Get MLRA GeoJSON polygons and symbolize based on MLRA name 
var MLRA = L.layerGroup().addTo(map);
    $.getJSON('data/MLRA_Oregon.geojson',function(data){
        L.geoJson(data, {
            style: function(feature){
                var fillColor,
                    MLRA = feature.properties.MLRA_NAME;
                    if ( MLRA === 'Blue and Seven Devils Mountains' ) fillColor = ("#cf9493");
                        else if ( MLRA === 'Cascade Mountains, Eastern Slope' ) fillColor = ("#b8b7ed");
                        else if ( MLRA === 'Central Rocky and Blue Mountain Foothills' ) fillColor = ("#ebd2c5");
                        else if ( MLRA === 'Coastal Redwood Belt' ) fillColor = ("#cf9fb3");
                        else if ( MLRA === 'Columbia Basin' ) fillColor = ("#c1c6e6");
                        else if ( MLRA === 'Columbia Plateau' ) fillColor = ("#9ebdd9");
                        else if ( MLRA === 'Humboldt Basin and Range Area' ) fillColor = ("#d396d4");
                        else if ( MLRA === 'Klamath and Shasta Valleys and Basins' ) fillColor = ("#abc4ed");
                        else if ( MLRA === 'Malheur High Plateau' ) fillColor = ("#dec4a6");
                        else if ( MLRA === 'Northern Pacific Coast Range, Foothills, and Valleys' ) fillColor = ("#d0b5eb");
                        else if ( MLRA === 'Olympic and Cascade Mountains' ) fillColor = ("#b5a9cf");
                        else if ( MLRA === 'Owyhee High Plateau' ) fillColor = ("#f0c0c1");
                        else if ( MLRA === 'Palouse and Nez Perce Prairies' ) fillColor = ("#cadded");
                        else if ( MLRA === 'Siskiyou-Trinity Area' ) fillColor = ("#f0afd9");
                        else if ( MLRA === 'Sitka Spruce Belt' ) fillColor = ("#ccb2a9");
                        else if ( MLRA === 'Snake River Plains' ) fillColor = ("#9ea0db");
                        else if ( MLRA === 'Willamette and Puget Sound Valleys' ) fillColor = ("#d5b2d6");       

                    return { color: fillColor, weight: 1, opacity: 1};
            },

            onEachFeature: function(feature, featureLayer) {
                featureLayer.bindPopup("<p><strong>Major Land Resource Area: </strong>" + feature.properties.MLRA_NAME + "</p>");
                
                // Highlight MLRA Polygon on mouseover
                featureLayer.on('mouseover', function () {
                    //featureLayer.openPopup();
                    this.setStyle({
                        'fillColor': 'brown',
                    });
                });
                // Dehighlight MLRA Polygon on mouseout
                featureLayer.on('mouseout', function () {
                    this.setStyle({
                        'fillColor': ''
                    });
                });
            }
        }).addTo(MLRA);
    });


// Dynamic legend function
function Legend() {
    let legendHTML = '';
    
    if(document.getElementById('Confidence').checked) {
        
        legendHTML += '<div><span style="background-color: #b39262; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Landslides</div>';
    }
    
    if(document.getElementById('MLRA').checked) {
        
        legendHTML += '<div><span style="display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> <br>Major Land Resource Areas<br><br></div>';
        
        legendHTML += '<div><span style="background-color: #cf9493; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Blue and Seven Devils Mountains';
  
        legendHTML += '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;<span style="background-color: #b8b7ed; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Cascade Mountains, Eastern Slope</div>';
 
        legendHTML += '<div><span style="background-color: #ebd2c5; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Central Rocky and Blue Mountain Foothills';
  
        legendHTML += '&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;<span style="background-color: #cf9fb3; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Coastal Redwood Belt</div>';
        
        legendHTML += '<div><span style="background-color: #d0b5eb; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Northern Pacific Coast Range, Foothills, and Valleys';
   
        legendHTML += '&emsp;<span style="background-color: #c1c6e6; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Columbia Basin</div>';
 
        legendHTML += '<div><span style="background-color: #9ebdd9; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Columbia Plateau';
  
        legendHTML += '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;<span style="background-color: #d396d4; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Humboldt Basin and Range Area</div>';
        
        legendHTML += '<div><span style="background-color: #abc4ed; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Klamath and Shasta Valleys and Basins';
        
        legendHTML += '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;<span style="background-color: #dec4a6; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Malheur High Plateau</div>';
        
        legendHTML += '<div><span style="background-color: #b5a9cf; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Olympic and Cascade Mountains';
        
        legendHTML += '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;<span style="background-color: #f0c0c1; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Owyhee High Plateau</div>';
        
        legendHTML += '<div><span style="background-color: #cadded; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Palouse and Nez Perce Prairies';
        
        legendHTML += '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="background-color: #f0afd9; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Siskiyou-Trinity Area</div>';
        
        legendHTML += '<div><span style="background-color: #ccb2a9; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Sitka Spruce Belt';
        
        legendHTML += '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;<span style="background-color: #9ea0db; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Snake River Plains</div>';
        
        legendHTML += '<div><span style="background-color: #d5b2d6; display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></span> Willamette and Puget Sound Valleys</div>';
    }
    
    document.getElementById('Legend').innerHTML = legendHTML;
}


// Initialize the legend
Legend();
