import { motion } from 'framer-motion';
import { BarChartOutlined } from '@ant-design/icons';

const FeatureHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-24"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 mb-6"
      >
        <BarChartOutlined className="text-blue-600" />
        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          核心功能
        </span>
      </motion.div>
      <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        强大功能，
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          开箱即用
        </span>
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        一站式问卷解决方案，满足您的所有需求
      </p>
    </motion.div>
  );
};

export default FeatureHeader;

