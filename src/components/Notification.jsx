import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const Notification = ({ type, message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FiCheckCircle className="text-green-500" size={24} />;
            case 'error':
                return <FiAlertCircle className="text-red-500" size={24} />;
            default:
                return <FiCheckCircle className="text-blue-500" size={24} />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${getBgColor()} shadow-lg max-w-md`}
                >
                    <div className="flex items-center">
                        {getIcon()}
                        <p className="ml-3 text-gray-800 flex-1">{message}</p>
                        <button
                            onClick={onClose}
                            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;