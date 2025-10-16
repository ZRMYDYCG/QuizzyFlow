import { motion } from 'framer-motion';
import { SafetyOutlined, GlobalOutlined } from '@ant-design/icons';

const FooterBottom = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <p className="text-sm text-gray-500">
        © 2025 QuizzyFlow. All rights reserved.
      </p>
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer hover:text-gray-400 transition-colors"
        >
          <SafetyOutlined />
          <span>安全认证</span>
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer hover:text-gray-400 transition-colors"
        >
          <GlobalOutlined />
          <span>全球服务</span>
        </motion.span>
      </div>
    </motion.div>
  );
};

export default FooterBottom;

