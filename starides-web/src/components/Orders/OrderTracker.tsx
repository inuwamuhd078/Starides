import React from 'react';
import './OrderTracker.css';

interface OrderTrackerProps {
    status: string;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ status }) => {
    const steps = [
        { label: 'Placed', value: 'PENDING' },
        { label: 'Confirmed', value: 'CONFIRMED' },
        { label: 'Preparing', value: 'PREPARING' },
        { label: 'On the Way', value: 'OUT_FOR_DELIVERY' },
        { label: 'Delivered', value: 'DELIVERED' }
    ];

    const getCurrentStepIndex = () => {
        if (status === 'CANCELLED' || status === 'REJECTED') return -1;
        const index = steps.findIndex(step => step.value === status);
        // Map waiting statuses to steps
        if (status === 'READY_FOR_PICKUP') return 2; // Treat as prepared
        return index !== -1 ? index : 0;
    };

    const currentStep = getCurrentStepIndex();

    if (status === 'CANCELLED' || status === 'REJECTED') {
        return (
            <div className="order-tracker cancelled">
                <div className="tracker-message error">
                    ❌ Order {status.toLowerCase()}
                </div>
            </div>
        );
    }

    return (
        <div className="order-tracker">
            <div className="tracker-steps">
                {steps.map((step, index) => (
                    <div
                        key={step.value}
                        className={`tracker-step ${index <= currentStep ? 'active' : ''}`}
                    >
                        <div className="step-point"></div>
                        <div className="step-label">{step.label}</div>
                        {index < steps.length - 1 && (
                            <div className={`step-line ${index < currentStep ? 'completed' : ''}`}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTracker;
