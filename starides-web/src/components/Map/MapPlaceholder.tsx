
import React from 'react';
import './MapPlaceholder.css';

interface MapPlaceholderProps {
    type?: 'loading' | 'error' | 'missing-key';
    height?: string;
    className?: string;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
    type = 'missing-key',
    height = '100%',
    className = ''
}) => {
    const getContent = () => {
        switch (type) {
            case 'loading':
                return (
                    <div className="placeholder-content">
                        <div className="spinner"></div>
                        <p>Loading Map...</p>
                    </div>
                );
            case 'error':
                return (
                    <div className="placeholder-content">
                        <span className="icon">⚠️</span>
                        <p>Map Unavailable</p>
                    </div>
                );
            case 'missing-key':
            default:
                return (
                    <div className="placeholder-content">
                        <span className="icon">🗺️</span>
                        <h3>Map Preview</h3>
                        <p className="sub-text">Google Maps is not configured</p>
                    </div>
                );
        }
    };

    return (
        <div className={`map-placeholder ${type} ${className}`} style={{ height }}>
            {getContent()}
        </div>
    );
};

export default MapPlaceholder;
