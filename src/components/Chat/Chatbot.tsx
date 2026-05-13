import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Expand, Shrink } from 'lucide-react';
import apiClient from '../../api/apiClient';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'Hi! I am the TPGIT Hostel Assistant. How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await apiClient.post('/chat', {
                message: userMessage,
                history: messages.map(m => ({ role: m.role === 'bot' ? 'model' : 'user', content: m.content }))
            });

            setMessages(prev => [...prev, { role: 'bot', content: response.data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I am offline. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''} ${isFullScreen ? 'full-screen' : ''}`}>
            {!isOpen ? (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                    <MessageSquare size={24} />
                    <span className="chatbot-badge">AI</span>
                </button>
            ) : (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3>TPGIT Assistant</h3>
                                <p>Online • AI Powered</p>
                            </div>
                        </div>
                        <div className="chatbot-header-actions">
                            {!isMinimized && (
                                <button onClick={() => setIsFullScreen(!isFullScreen)} title={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
                                    {isFullScreen ? <Shrink size={16} /> : <Expand size={16} />}
                                </button>
                            )}
                            <button onClick={() => { setIsMinimized(!isMinimized); setIsFullScreen(false); }} title={isMinimized ? "Maximize" : "Minimize"}>
                                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            </button>
                            <button onClick={() => { setIsOpen(false); setIsFullScreen(false); }} title="Close">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            <div className="chatbot-messages">
                                {messages.map((m, i) => (
                                    <div key={i} className={`chat-bubble ${m.role}`}>
                                        <div className="bubble-icon">
                                            {m.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                                        </div>
                                        <div className="bubble-content">
                                            {m.role === 'bot' ? (
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            ) : (
                                                m.content
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="chat-bubble bot">
                                        <div className="bubble-icon">
                                            <Bot size={14} />
                                        </div>
                                        <div className="bubble-content loading">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chatbot-input">
                                <input
                                    type="text"
                                    placeholder="Ask me anything..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button onClick={handleSend} disabled={!input.trim() || loading}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
