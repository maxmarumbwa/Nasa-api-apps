// 1. Initialize the map, centered on the world
const map = L.map('map').setView([20, 0], 2);

// 2. Add a base map (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. Add the NASA GIBS VIIRS NDVI WMS Layer
// Using the layer name you found: MODIS_Combined_Thermal_Anomalies_All
const gibsWmsLayer = L.tileLayer.wms('https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?', {
    layers: 'MODIS_Combined_Thermal_Anomalies_All', // The thermal anomalies layer
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: 'NASA GIBS',
    opacity: 0.7 // Adjust opacity to blend with base map
}).addTo(map);

// 4. (Optional) Add a simple layer control
L.control.layers({
    'Base Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
}, {
    'Thermal Anomalies': gibsWmsLayer
}, {
    collapsed: false
}).addTo(map);