import { readFileSync } from 'fs';
import { join } from 'path';

const rawData = JSON.parse(readFileSync(join(__dirname, '../../sample.json'), 'utf8'));

// Process the data to create a single FeatureCollection
export const geoData = {
    type: "FeatureCollection",
    features: rawData.reduce((acc, collection) => {
        // Sort features by timestamp if present
        const sortedFeatures = collection.features.sort((a, b) =>
            (a.properties?._timestamp || 0) - (b.properties?._timestamp || 0)
        );
        return [...acc, ...sortedFeatures];
    }, [])
};