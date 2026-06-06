import { motion } from 'framer-motion';

export const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
    >
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-sm hover:opacity-80">
          ✕
        </button>
      )}
    </motion.div>
  );
};

export const SuccessMessage = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      {message}
    </motion.div>
  );
};
