
import React from 'react';
import './ImagePlaceholder.css';

interface ImagePlaceholderProps {
    text?: string;
    icon?: string;
    height?: string;
    width?: string;
    className?: string;
    shape?: 'rectangle' | 'circle';
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
    text = 'No Image',
    icon = '🖼️',
    height = '100%',
    width = '100%',
    className = '',
    shape = 'rectangle'
}) => {
    return (
        <div
            className={`image-placeholder ${shape} ${className}`}
            style={{ height, width }}
        >
            <div className="placeholder-content">
                <span className="placeholder-icon">{icon}</span>
                {text && <span className="placeholder-text">{text}</span>}
            </div>
        </div>
    );
};

export default ImagePlaceholder;
