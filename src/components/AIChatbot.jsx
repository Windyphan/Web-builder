import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: "Hello! I'm your AI assistant powered by machine learning. How can I help you with web development today?",
            timestamp: new Date().toISOString(),
            intent: 'greeting',
            confidence: 1.0
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputMessage;
        setInputMessage('');
        setIsLoading(true);

        try {
            // Use your Cloudflare Worker endpoint which connects to your server directory Python AI
            const workerUrl = 'https://www.theinnovationcurve.com'; // Your main domain with Cloudflare Worker
            const response = await fetch(`${workerUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentInput
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: data.response || data.message || "I received your message but couldn't generate a proper response.",
                timestamp: data.timestamp || new Date().toISOString(),
                intent: data.intent || 'unknown',
                confidence: data.confidence || 0.0
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error with Python AI API:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: "I'm sorry, I'm experiencing technical difficulties with my AI brain. This usually means my Python server is starting up or temporarily unavailable. Please try again in a moment!",
                timestamp: new Date().toISOString(),
                intent: 'error',
                confidence: 0.0
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        // Reset to initial state - no need to reset AI instance since we're using API
        setMessages([
            {
                id: 1,
                type: 'bot',
                content: "Hello! I'm your AI assistant powered by machine learning. How can I help you with web development today?",
                timestamp: new Date().toISOString(),
                intent: 'greeting',
                confidence: 1.0
            }
        ]);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ${
                    true 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                        : 'bg-gray-500 cursor-not-allowed'
                }`}
                whileHover={true ? { scale: 1.1 } : {}}
                whileTap={true ? { scale: 0.9 } : {}}
                disabled={false}
                title={true ? "Open AI Chat" : "AI Model Loading..."}
            >
                {true ? (
                    isOpen ? '✕' : '🤖'
                ) : (
                    <div className="animate-spin">⚙️</div>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-16 right-0 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">AI Assistant</h3>
                                <p className="text-xs opacity-90">Web Development Helper</p>
                            </div>
                            <button
                                onClick={clearChat}
                                className="text-white hover:text-gray-200 text-sm"
                                title="Clear Chat"
                            >
                                🗑️
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                            message.type === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                                        }`}
                                    >
                                        <p>{message.content}</p>
                                        {message.type === 'bot' && message.confidence !== undefined && (
                                            <div className="text-xs mt-1 opacity-70">
                                                Confidence: {(message.confidence * 100).toFixed(1)}%
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex space-x-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Ask about web development..."
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIChatbot;
