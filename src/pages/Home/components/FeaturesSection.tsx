import { motion } from 'framer-motion';
import { FormOutlined, LineChartOutlined, MobileOutlined } from '@ant-design/icons';
import FeatureHeader from './FeatureHeader';
import FeatureCard from './FeatureCard';
import FeaturePreview from './FeaturePreview';

const FeaturesSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeatureHeader />

        <div className="space-y-32">
          {/* 拖拽式设计 */}
          <FeatureCard
            icon={<FormOutlined className="text-5xl" />}
            title="拖拽式设计"
            description="无需编码，通过直观的拖拽操作快速构建专业问卷。支持多种题型，自由组合，实时预览效果。"
            tags={[
              { text: '可视化编辑', className: 'px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium' },
              { text: '实时预览', className: 'px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium' },
              { text: '多种题型', className: 'px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium' }
            ]}
            iconGradient="from-blue-500 to-cyan-500"
            iconShadow="shadow-blue-500/30"
            preview={
              <FeaturePreview gradient="from-blue-500 to-cyan-500" rotate={1}>
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-3">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ duration: 2, repeat: Infinity }} 
                      className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg" 
                    />
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ duration: 2, delay: 0.2, repeat: Infinity }} 
                      className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl shadow-lg" 
                    />
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ duration: 2, delay: 0.4, repeat: Infinity }} 
                      className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl shadow-lg" 
                    />
                  </div>
                  <p className="text-gray-400 font-medium">拖拽组件快速构建</p>
                </div>
              </FeaturePreview>
            }
          />

          {/* 实时数据分析 */}
          <FeatureCard
            icon={<LineChartOutlined className="text-5xl" />}
            title="实时数据分析"
            description="自动生成可视化图表，深入洞察用户反馈。支持多维度数据分析，让决策更科学。"
            tags={[
              { text: '图表可视化', className: 'px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium' },
              { text: '数据导出', className: 'px-4 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium' },
              { text: '智能分析', className: 'px-4 py-2 bg-fuchsia-50 text-fuchsia-700 rounded-lg text-sm font-medium' }
            ]}
            iconGradient="from-purple-500 to-pink-500"
            iconShadow="shadow-purple-500/30"
            reverse
            preview={
              <FeaturePreview gradient="from-purple-500 to-pink-500" rotate={-1}>
                <div className="w-full space-y-4">
                  <motion.div 
                    animate={{ scaleX: [0.5, 1, 0.7] }} 
                    transition={{ duration: 3, repeat: Infinity }} 
                    className="h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg" 
                  />
                  <motion.div 
                    animate={{ scaleX: [0.8, 0.6, 1] }} 
                    transition={{ duration: 3, repeat: Infinity }} 
                    className="h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg" 
                  />
                  <motion.div 
                    animate={{ scaleX: [0.4, 0.9, 0.5] }} 
                    transition={{ duration: 3, repeat: Infinity }} 
                    className="h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg" 
                  />
                  <p className="text-center text-gray-400 font-medium pt-4">实时数据可视化</p>
                </div>
              </FeaturePreview>
            }
          />

          {/* 多端适配 */}
          <FeatureCard
            icon={<MobileOutlined className="text-5xl" />}
            title="多端完美适配"
            description="完美支持PC、平板、手机等多种设备访问。响应式设计，自适应各种屏幕尺寸。"
            tags={[
              { text: '响应式设计', className: 'px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium' },
              { text: '触屏优化', className: 'px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium' },
              { text: '跨平台', className: 'px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium' }
            ]}
            iconGradient="from-green-500 to-emerald-500"
            iconShadow="shadow-green-500/30"
            preview={
              <FeaturePreview gradient="from-green-500 to-emerald-500" rotate={1}>
                <div className="flex items-end justify-center gap-4">
                  <motion.div 
                    whileHover={{ y: -10 }} 
                    className="w-20 h-32 bg-gradient-to-t from-green-500 to-emerald-400 rounded-2xl shadow-lg flex items-end justify-center pb-2"
                  >
                    <div className="text-white text-xs">Phone</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -10 }} 
                    className="w-24 h-40 bg-gradient-to-t from-green-500 to-emerald-400 rounded-2xl shadow-lg flex items-end justify-center pb-2"
                  >
                    <div className="text-white text-xs">Tablet</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -10 }} 
                    className="w-32 h-24 bg-gradient-to-t from-green-500 to-emerald-400 rounded-2xl shadow-lg flex items-end justify-center pb-2"
                  >
                    <div className="text-white text-xs">Desktop</div>
                  </motion.div>
                </div>
              </FeaturePreview>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

