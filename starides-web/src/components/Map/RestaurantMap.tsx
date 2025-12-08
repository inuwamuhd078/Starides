import React, { useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import MapContainer from './MapContainer';
import './Map.css';

interface Restaurant {
    id: string;
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    phone?: string;
    rating?: number;
}

interface RestaurantMapProps {
    restaurant: Restaurant;
    height?: string;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({ restaurant, height = '400px' }) => {
    const [showInfo, setShowInfo] = useState(true);

    const center = {
        lat: restaurant.address.coordinates.latitude,
        lng: restaurant.address.coordinates.longitude
    };

    return (
        <div className="restaurant-map-wrapper" style={{ height }}>
            <MapContainer center={center} zoom={15} className="restaurant-map">
                <Marker
                    position={center}
                    onClick={() => setShowInfo(!showInfo)}
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        scaledSize: new google.maps.Size(40, 40)
                    }}
                />
                {showInfo && (
                    <InfoWindow
                        position={center}
                        onCloseClick={() => setShowInfo(false)}
                    >
                        <div className="map-info-window">
                            <h3>{restaurant.name}</h3>
                            <p className="address">
                                {restaurant.address.street}<br />
                                {restaurant.address.city}, {restaurant.address.state}
                            </p>
                            {restaurant.phone && (
                                <p className="phone">📞 {restaurant.phone}</p>
                            )}
                            {restaurant.rating && (
                                <p className="rating">⭐ {restaurant.rating.toFixed(1)}</p>
                            )}
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="directions-link"
                            >
                                Get Directions →
                            </a>
                        </div>
                    </InfoWindow>
                )}
            </MapContainer>
        </div>
    );
};

export default RestaurantMap;
