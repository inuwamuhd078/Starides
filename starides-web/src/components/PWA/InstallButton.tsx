import React from 'react';
import { useInstallPWA } from '../../hooks/useInstallPWA';
import './InstallButton.css';

const InstallButton: React.FC = () => {
    const { isInstallable, promptInstall } = useInstallPWA();

    // Don't render if not installable
    if (!isInstallable) {
        return null;
    }

    return (
        <button onClick={promptInstall} className="install-btn">
            <span className="install-icon">📱</span>
            <span>Install App</span>
        </button>
    );
};

export default InstallButton;
