import React from 'react';
import './MapFAB.css';

interface MapFABProps {
    onClick: () => void;
    isOpen: boolean;
}

const MapFAB: React.FC<MapFABProps> = ({ onClick, isOpen }) => {
    return (
        <button
            className={`map-fab ${isOpen ? 'active' : ''}`}
            onClick={onClick}
            title="Open Map"
            aria-label="Open Map"
        >
            <span className="icon">🗺️</span>
        </button>
    );
};

export default MapFAB;
