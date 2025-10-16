import { motion } from 'framer-motion';
import { 
  RocketOutlined, 
  ThunderboltOutlined, 
  SafetyOutlined,
  GlobalOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

interface HeroContentProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

const HeroContent = ({ onRegisterClick, onLoginClick }: HeroContentProps) => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* 标签 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 shadow-lg"
        >
          <RocketOutlined className="text-blue-600" />
          <span className="text-sm font-medium text-gray-700">新一代问卷低代码平台</span>
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold"
        >
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            QuizzyFlow
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-4xl font-bold text-gray-800"
        >
          让问卷设计
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 简单高效</span>
          <br />
          让数据洞察
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> 触手可及</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          专业的拖拽式问卷编辑器，实时数据分析，多端完美适配
          <br />
          无需编程基础，即可创建专业级问卷系统
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegisterClick}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
          >
            <ThunderboltOutlined />
            立即免费使用
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoginClick}
            className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300"
          >
            登录体验
          </motion.button>
        </motion.div>

        {/* 社会证明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <SafetyOutlined />
            <span>数据安全可靠</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobalOutlined />
            <span>云端实时同步</span>
          </div>
          <div className="flex items-center gap-2">
            <AppstoreOutlined />
            <span>海量模板库</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroContent;

