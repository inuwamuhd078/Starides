import React from 'react';
import MapContainer from './MapContainer';
import { Marker } from '@react-google-maps/api';
import './MapModal.css';

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Use a default center (e.g., New York, or user's location if available)
    const center = { lat: 40.7128, lng: -74.0060 };

    return (
        <div className="map-modal-overlay" onClick={onClose}>
            <div className="map-modal-content" onClick={e => e.stopPropagation()}>
                <div className="map-modal-header">
                    <h3>Explore Nearby</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="map-modal-body">
                    <MapContainer center={center} zoom={13} className="modal-map">
                        <Marker position={center} title="You are here" />
                        {/* We could fetch and map restaurant markers here in the future */}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MapModal;
