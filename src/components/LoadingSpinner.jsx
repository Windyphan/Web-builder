import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
            <motion.div
                className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export default LoadingSpinner;