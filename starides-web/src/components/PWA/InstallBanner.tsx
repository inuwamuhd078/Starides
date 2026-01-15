import React, { useState, useEffect } from 'react';
import { useInstallPWA } from '../../hooks/useInstallPWA';
import './InstallBanner.css';

const InstallBanner: React.FC = () => {
    const { isInstallable, promptInstall } = useInstallPWA();
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if user has previously dismissed the banner
        const dismissed = localStorage.getItem('pwa-banner-dismissed');
        if (dismissed === 'true') {
            setIsDismissed(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsDismissed(true);
        localStorage.setItem('pwa-banner-dismissed', 'true');
    };

    const handleInstall = () => {
        promptInstall();
        // Dismiss banner after triggering install
        handleDismiss();
    };

    // Don't render if not installable or dismissed
    if (!isInstallable || isDismissed) {
        return null;
    }

    return (
        <div className="install-banner">
            <div className="install-banner-content">
                <div className="install-banner-icon">📱</div>
                <div className="install-banner-text">
                    <h3 className="install-banner-title">Install Starides App</h3>
                    <p className="install-banner-description">
                        Get faster access and a better experience!
                    </p>
                </div>
                <div className="install-banner-actions">
                    <button onClick={handleInstall} className="install-banner-btn primary">
                        Install Now
                    </button>
                    <button onClick={handleDismiss} className="install-banner-dismiss" aria-label="Dismiss">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallBanner;
