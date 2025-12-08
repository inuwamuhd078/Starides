import React, { useState, useEffect } from 'react';
import { Marker, Polyline } from '@react-google-maps/api';
import MapContainer from './MapContainer';
import './Map.css';

interface Location {
    latitude: number;
    longitude: number;
}

interface DeliveryTrackerProps {
    restaurantLocation: Location;
    customerLocation: Location;
    riderLocation?: Location;
    orderStatus: string;
    height?: string;
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
    restaurantLocation,
    customerLocation,
    riderLocation,
    orderStatus,
    height = '500px'
}) => {
    const [center, setCenter] = useState({
        lat: restaurantLocation.latitude,
        lng: restaurantLocation.longitude
    });

    const restaurantPos = {
        lat: restaurantLocation.latitude,
        lng: restaurantLocation.longitude
    };

    const customerPos = {
        lat: customerLocation.latitude,
        lng: customerLocation.longitude
    };

    const riderPos = riderLocation
        ? { lat: riderLocation.latitude, lng: riderLocation.longitude }
        : null;

    // Calculate center point to show all markers
    useEffect(() => {
        const lats = [restaurantPos.lat, customerPos.lat];
        const lngs = [restaurantPos.lng, customerPos.lng];

        if (riderPos) {
            lats.push(riderPos.lat);
            lngs.push(riderPos.lng);
        }

        const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

        setCenter({ lat: centerLat, lng: centerLng });
    }, [restaurantLocation, customerLocation, riderLocation]);

    // Route path
    const routePath = riderPos
        ? [restaurantPos, riderPos, customerPos]
        : [restaurantPos, customerPos];

    return (
        <div className="delivery-tracker-wrapper" style={{ height }}>
            <MapContainer center={center} zoom={13} className="delivery-tracker-map">
                {/* Restaurant Marker */}
                <Marker
                    position={restaurantPos}
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        scaledSize: new google.maps.Size(40, 40)
                    }}
                    title="Restaurant"
                />

                {/* Customer Marker */}
                <Marker
                    position={customerPos}
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                        scaledSize: new google.maps.Size(40, 40)
                    }}
                    title="Delivery Address"
                />

                {/* Rider Marker (if available) */}
                {riderPos && (
                    <Marker
                        position={riderPos}
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            scaledSize: new google.maps.Size(40, 40)
                        }}
                        title="Delivery Rider"
                    />
                )}

                {/* Route Line */}
                <Polyline
                    path={routePath}
                    options={{
                        strokeColor: '#0ea5e9',
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                        geodesic: true
                    }}
                />

                {/* Legend */}
                <div className="tracker-legend">
                    <h4>Delivery Status: {orderStatus}</h4>
                    <div className="legend-item">
                        <div className="legend-marker restaurant"></div>
                        <span>Restaurant</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-marker customer"></div>
                        <span>Your Location</span>
                    </div>
                    {riderPos && (
                        <div className="legend-item">
                            <div className="legend-marker rider"></div>
                            <span>Rider</span>
                        </div>
                    )}
                </div>
            </MapContainer>
        </div>
    );
};

export default DeliveryTracker;
