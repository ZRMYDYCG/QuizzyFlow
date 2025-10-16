import { motion } from 'framer-motion';

const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
        <motion.div
          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

export default ScrollIndicator;

