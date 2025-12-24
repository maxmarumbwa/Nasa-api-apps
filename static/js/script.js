// 1. Initialize map centered on Zimbabwe
const map = L.map('map').setView([-18.7, 29.5], 7);

// 2. Add base map
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. Add NASA GIBS NDVI layer
const ndviLayer = L.tileLayer.wms('https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?', {
    layers: 'VIIRS_SNPP_NDVI_8Day',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: 'NASA GIBS',
    opacity: 0.7
}).addTo(map);

// 4. Load Zimbabwe boundaries and constrain view
// Load Zimbabwe boundaries - SIMPLER VERSION
fetch('/static/data/zim_admin1.geojson')
    .then(response => response.json())
    .then(data => {
        const zimBoundaries = L.geoJSON(data, {
            style: {color: '#FF5733', weight: 2, fillOpacity: 0.1}
        }).addTo(map);
        
        const zimBounds = zimBoundaries.getBounds();
        
        // HARDCODE minimum zoom (adjust 6 based on your needs)
        map.setMinZoom(7);
        map.setMaxBounds(zimBounds);
        map.fitBounds(zimBounds);
        
        // Force re-fit if user manages to zoom out
        map.on('zoomend', () => {
            if (map.getZoom() < 7) map.setZoom(7);
        });
    });
// 5. Layer control
const baseLayers = {
    'OpenStreetMap': osmLayer,
    'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri, Maxar, Earthstar Geographics'
    })
};

const overlayLayers = {
    'VIIRS NDVI': ndviLayer
    // Note: zimBoundaries is added dynamically above
};

L.control.layers(baseLayers, overlayLayers, {
    collapsed: true
}).addTo(map);