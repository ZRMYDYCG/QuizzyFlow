import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeaturePreviewProps {
  children: ReactNode;
  gradient: string;
  rotate?: number;
}

const FeaturePreview = ({ children, gradient, rotate = 1 }: FeaturePreviewProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotate }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl opacity-25 group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
      <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 h-80 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};

export default FeaturePreview;

