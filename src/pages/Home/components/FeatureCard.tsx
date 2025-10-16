import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  tags: Array<{ text: string; className: string }>;
  preview: ReactNode;
  reverse?: boolean;
  iconGradient: string;
  iconShadow: string;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  tags, 
  preview, 
  reverse = false,
  iconGradient,
  iconShadow
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="grid md:grid-cols-2 gap-12 items-center"
    >
      <div className={`space-y-8 ${reverse ? 'order-1 md:order-2' : ''}`}>
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${iconGradient} text-white shadow-2xl ${iconShadow}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {description}
          </p>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, index) => (
              <span key={index} className={tag.className}>
                {tag.text}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={reverse ? 'order-2 md:order-1' : ''}>
        {preview}
      </div>
    </motion.div>
  );
};

export default FeatureCard;

