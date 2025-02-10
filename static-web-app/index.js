const subscriptionKey = '3svi8dbOvjiA2c9U8CAvejrurNAlyhh1YYR909sn8NaG7cRJdezRJQQJ99BBAC5RqLJSBCjIAAAgAZMP4YXj';
const apiUrl = 'http://localhost:7071/api/geojson'; // Updated to match the function route

let map, datasource, animation;

async function initialize() {
    console.log('Initializing map...');
    map = new atlas.Map('myMap', {
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: subscriptionKey
        },
        center: [16.98825731, 59.93411019],
        zoom: 12,
        view: 'Auto'
    });

    map.events.add('ready', async () => {
        console.log('Map ready...');
        datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        // Add a layer for rendering the route line
        map.layers.add(new atlas.layer.LineLayer(datasource, null, {
            strokeColor: '#2272B9',
            strokeWidth: 3
        }));

        // Add a layer for rendering point data
        map.layers.add(new atlas.layer.SymbolLayer(datasource, null, {
            iconOptions: {
                image: 'marker-red'
            }
        }));

        try {
            console.log('Fetching GPS data...');
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log('GPS data received:', data);

            // Extract coordinates from features
            const positions = data.features.map(feature => feature.geometry.coordinates);
            console.log('Extracted positions:', positions);

            startAnimation(positions);
        } catch (error) {
            console.error('Error loading GPS data:', error);
        }
    });
}

function startAnimation(positions) {
    console.log('Starting animation with positions:', positions.length);
    let idx = 0;
    const speed = 100; // milliseconds between frames

    // Clear any existing animation
    if (animation) {
        clearInterval(animation);
    }

    animation = setInterval(() => {
        if (idx < positions.length) {
            datasource.clear();

            // Add a point for the current position
            datasource.add(new atlas.data.Feature(new atlas.data.Point(positions[idx])));

            // Add a line for the route up to the current position
            datasource.add(new atlas.data.Feature(new atlas.data.LineString(positions.slice(0, idx + 1))));

            // Center the map on the current position with some zoom
            map.setCamera({
                center: positions[idx],
                zoom: 14,
                type: 'jump'
            });

            idx++;
        } else {
            clearInterval(animation);
            // Restart animation after a delay
            setTimeout(() => startAnimation(positions), 2000);
        }
    }, speed);
}

// Initialize on page load
window.onload = initialize;