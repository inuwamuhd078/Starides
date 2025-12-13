import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import MapPlaceholder from './MapPlaceholder';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

interface MapContainerProps {
    children: React.ReactNode;
    center?: { lat: number; lng: number };
    zoom?: number;
    onLoad?: (map: google.maps.Map) => void;
    onClick?: (e: google.maps.MapMouseEvent) => void;
    className?: string;
}

const defaultCenter = {
    lat: 40.7128, // New York City
    lng: -74.0060
};

const MapContainer: React.FC<MapContainerProps> = ({
    children,
    center = defaultCenter,
    zoom = 13,
    onLoad,
    onClick,
    className = 'map-container'
}) => {
    // Check key explicitly against placeholders
    const isValidKey = GOOGLE_MAPS_API_KEY &&
        GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here' &&
        GOOGLE_MAPS_API_KEY !== 'your_key_here';

    if (!isValidKey) {
        return <MapPlaceholder type="missing-key" className={className} />;
    }

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
    });

    if (loadError) {
        return <MapPlaceholder type="error" className={className} />;
    }

    if (!isLoaded) {
        return <MapPlaceholder type="loading" className={className} />;
    }

    return (
        <GoogleMap
            mapContainerClassName={className}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onClick={onClick}
            options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
            }}
        >
            {children}
        </GoogleMap>
    );
};

export default MapContainer;
