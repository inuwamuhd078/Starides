import React, { useState, useCallback, useRef } from 'react';
import { Marker, Autocomplete } from '@react-google-maps/api';
import MapContainer from './MapContainer';
import './Map.css';

interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
}

interface AddressSelectorProps {
    onAddressSelect: (address: Address) => void;
    initialAddress?: Address;
    height?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
    onAddressSelect,
    initialAddress,
    height = '400px'
}) => {
    const [markerPosition, setMarkerPosition] = useState(
        initialAddress
            ? { lat: initialAddress.latitude, lng: initialAddress.longitude }
            : { lat: 40.7128, lng: -74.0060 }
    );
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(initialAddress || null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    }, []);

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();

            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                setMarkerPosition({ lat, lng });

                // Parse address components
                const addressComponents = place.address_components || [];
                const address: Address = {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    latitude: lat,
                    longitude: lng
                };

                addressComponents.forEach(component => {
                    const types = component.types;
                    if (types.includes('street_number') || types.includes('route')) {
                        address.street += component.long_name + ' ';
                    }
                    if (types.includes('locality')) {
                        address.city = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        address.state = component.short_name;
                    }
                    if (types.includes('postal_code')) {
                        address.zipCode = component.long_name;
                    }
                });

                address.street = address.street.trim();
                setSelectedAddress(address);
                onAddressSelect(address);
            }
        }
    };

    const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPosition({ lat, lng });

            // Reverse geocode to get address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const addressComponents = results[0].address_components;
                    const address: Address = {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        latitude: lat,
                        longitude: lng
                    };

                    addressComponents.forEach(component => {
                        const types = component.types;
                        if (types.includes('street_number') || types.includes('route')) {
                            address.street += component.long_name + ' ';
                        }
                        if (types.includes('locality')) {
                            address.city = component.long_name;
                        }
                        if (types.includes('administrative_area_level_1')) {
                            address.state = component.short_name;
                        }
                        if (types.includes('postal_code')) {
                            address.zipCode = component.long_name;
                        }
                    });

                    address.street = address.street.trim();
                    setSelectedAddress(address);
                    onAddressSelect(address);
                }
            });
        }
    };

    return (
        <div className="address-selector-wrapper" style={{ height }}>
            <MapContainer center={markerPosition} zoom={15} className="address-selector-map">
                <div className="address-search">
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <input
                            type="text"
                            placeholder="Search for an address..."
                            className="address-search-input"
                        />
                    </Autocomplete>
                </div>

                <Marker
                    position={markerPosition}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                        scaledSize: new google.maps.Size(40, 40)
                    }}
                />

                {selectedAddress && (
                    <div className="selected-address">
                        <h4>Selected Address:</h4>
                        <p>
                            {selectedAddress.street}<br />
                            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                        </p>
                    </div>
                )}
            </MapContainer>
        </div>
    );
};

export default AddressSelector;
