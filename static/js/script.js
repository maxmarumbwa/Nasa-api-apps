// 1. Initialize the map, centered on the world
const map = L.map('map').setView([-18.7, 29.5], 7);

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


let geojsonLayer;
fetch('static/data/zim_admin1.geojson')
    .then(r => r.json())
    .then(data => {
        geojsonLayer = L.geoJSON(data, {
            style: {color: '#FF5733', weight: 2, fillOpacity: 0.1},
            onEachFeature: (f, l) => {
                if(f.properties.ADM1_EN) l.bindPopup(f.properties.ADM1_EN);
                l.on('mouseover', () => l.setStyle({weight: 4, fillOpacity: 0.3}));
                l.on('mouseout', () => l.setStyle({weight: 2, fillOpacity: 0.1}));
            }
        }).addTo(map);
        map.fitBounds(geojsonLayer.getBounds());
    });
