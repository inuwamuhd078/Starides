import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

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
    const isValidKey = GOOGLE_MAPS_API_KEY &&
        GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here' &&
        GOOGLE_MAPS_API_KEY !== 'your_key_here';

    if (!isValidKey) {
        return (
            <div className={`${className} map-error`}>
                <div className="error-content">
                    <span className="error-icon">🗺️</span>
                    <h3>Google Maps API Key Required</h3>
                    <p>Please add your Google Maps API key to the .env file</p>
                    <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code>
                </div>
            </div>
        );
    }

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
    });

    if (loadError) {
        return (
            <div className={`${className} map-error`}>
                <p>Error loading map</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className={`${className} map-loading`}>
                <div className="loading-spinner"></div>
                <p>Loading map...</p>
            </div>
        );
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
