import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../../graphql/chat';
import './ChatWidget.css';

interface Message {
    id: string;
    text: string;
    sender: string;
    isBot: boolean;
    timestamp: string;
}

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: 'Hello! I am your Starides assistant. How can I help you today?',
            sender: 'AI Assistant',
            isBot: true,
            timestamp: new Date().toISOString()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [sendMessage, { loading }] = useMutation(SEND_MESSAGE, {
        onCompleted: (data) => {
            setMessages(prev => [...prev, data.sendMessage]);
        },
        onError: (error) => {
            console.error('Chat Error:', error);
            // Fallback for demo if backend fails or is not ready
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: "I'm having trouble connecting to the server. Please try again later.",
                sender: 'System',
                isBot: true,
                timestamp: new Date().toISOString()
            }]);
        }
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'You',
            isBot: false,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        const textToSend = input;
        setInput('');

        try {
            await sendMessage({ variables: { text: textToSend } });
        } catch (err) {
            // Error handled in onError
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-widget">
            <div className="chat-header">
                <h3>Starides Support</h3>
                <button onClick={onClose} className="close-button">×</button>
            </div>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                        <div className="message-content">
                            {msg.text}
                        </div>
                        <div className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message bot">
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={loading}
                />
                <button type="submit" disabled={!input.trim() || loading}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWidget;
