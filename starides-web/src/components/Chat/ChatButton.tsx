import React from 'react';
import './ChatButton.css';

interface ChatButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen }) => {
    return (
        <button
            className={`chat-fab ${isOpen ? 'open' : ''}`}
            onClick={onClick}
            aria-label="Toggle Chat"
        >
            {isOpen ? (
                <span className="icon">✕</span>
            ) : (
                <span className="icon">💬</span>
            )}
        </button>
    );
};

export default ChatButton;
