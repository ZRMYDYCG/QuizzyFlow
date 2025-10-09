import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  RocketOutlined, 
  ThunderboltOutlined, 
  SafetyOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  ApiOutlined,
  CloudOutlined,
  DashboardOutlined,
  FormOutlined,
  LineChartOutlined,
  MobileOutlined
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // 鼠标移动效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / 20,
          y: (e.clientY - rect.top - rect.height / 2) / 20
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <FormOutlined className="text-4xl" />,
      title: '拖拽式设计',
      description: '无需编码，通过直观的拖拽操作快速构建专业问卷',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <LineChartOutlined className="text-4xl" />,
      title: '实时数据分析',
      description: '自动生成可视化图表，深入洞察用户反馈',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <MobileOutlined className="text-4xl" />,
      title: '多端适配',
      description: '完美支持PC、平板、手机等多种设备访问',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <ApiOutlined className="text-4xl" />,
      title: '开放API',
      description: '提供完整的API接口，轻松集成到现有系统',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <CloudOutlined className="text-4xl" />,
      title: '云端存储',
      description: '数据安全可靠，支持大规模并发访问',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: <DashboardOutlined className="text-4xl" />,
      title: '智能模板',
      description: '海量行业模板库，一键启用快速上线',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const highlights = [
    {
      title: '5分钟',
      subtitle: '快速创建',
      description: '从零到发布仅需5分钟'
    },
    {
      title: '99.9%',
      subtitle: '稳定性',
      description: '企业级服务可用性保障'
    },
    {
      title: '10万+',
      subtitle: '活跃用户',
      description: '受到广泛认可和信赖'
    },
    {
      title: '∞',
      subtitle: '无限可能',
      description: '自定义逻辑满足各种需求'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 动态背景网格 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
            }}
          />
          
          {/* 浮动光球 */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              x: [0, -50, 0],
              y: [0, -80, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Hero Content */}
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
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <ThunderboltOutlined />
                立即免费使用
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
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

        {/* 向下滚动提示 */}
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
      </section>

      {/* Features Section - 交错式布局 */}
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
          {/* 标题区域 */}
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

          {/* 功能展示 - 左右交错布局 */}
          <div className="space-y-32">
            {/* 拖拽式设计 + 实时数据分析 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl shadow-blue-500/30">
                  <FormOutlined className="text-5xl" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    拖拽式设计
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    无需编码，通过直观的拖拽操作快速构建专业问卷。支持多种题型，自由组合，实时预览效果。
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">可视化编辑</span>
                    <span className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium">实时预览</span>
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">多种题型</span>
                  </div>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-25 group-hover:opacity-40 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 h-80 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center gap-3">
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg" />
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, delay: 0.2, repeat: Infinity }} className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl shadow-lg" />
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, delay: 0.4, repeat: Infinity }} className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl shadow-lg" />
                    </div>
                    <p className="text-gray-400 font-medium">拖拽组件快速构建</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* 实时数据分析 + 多端适配 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                transition={{ duration: 0.3 }}
                className="relative group order-2 md:order-1"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-25 group-hover:opacity-40 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 h-80 flex items-center justify-center">
                  <div className="w-full space-y-4">
                    <motion.div animate={{ scaleX: [0.5, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} className="h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg" />
                    <motion.div animate={{ scaleX: [0.8, 0.6, 1] }} transition={{ duration: 3, repeat: Infinity }} className="h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg" />
                    <motion.div animate={{ scaleX: [0.4, 0.9, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg" />
                    <p className="text-center text-gray-400 font-medium pt-4">实时数据可视化</p>
                  </div>
                </div>
              </motion.div>
              <div className="space-y-8 order-1 md:order-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/30">
                  <LineChartOutlined className="text-5xl" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    实时数据分析
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    自动生成可视化图表，深入洞察用户反馈。支持多维度数据分析，让决策更科学。
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">图表可视化</span>
                    <span className="px-4 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium">数据导出</span>
                    <span className="px-4 py-2 bg-fuchsia-50 text-fuchsia-700 rounded-lg text-sm font-medium">智能分析</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 多端适配 + API集成 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl shadow-green-500/30">
                  <MobileOutlined className="text-5xl" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    多端完美适配
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    完美支持PC、平板、手机等多种设备访问。响应式设计，自适应各种屏幕尺寸。
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">响应式设计</span>
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">触屏优化</span>
                    <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium">跨平台</span>
                  </div>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-25 group-hover:opacity-40 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 h-80 flex items-center justify-center">
                  <div className="flex items-end justify-center gap-4">
                    <motion.div whileHover={{ y: -10 }} className="w-20 h-32 bg-gradient-to-t from-green-500 to-emerald-400 rounded-2xl shadow-lg flex items-end justify-center pb-2">
                      <div className="text-white text-xs">Phone</div>
                    </motion.div>
                    <motion.div whileHover={{ y: -10 }} className="w-24 h-40 bg-gradient-to-t from-green-500 to-emerald-400 rounded-2xl shadow-lg flex items-end justify-center pb-2">
                      <div className="text-white text-xs">Tablet</div>
                    </motion.div>
                    <motion.div whileHover={{ y: -10 }} className="w-32 h-24 bg-gradient-to-t from-green-500 to-emerald-400 rounded-2xl shadow-lg flex items-end justify-center pb-2">
                      <div className="text-white text-xs">Desktop</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-400 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative border-b border-gray-800/50 py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="text-white">准备好开始了吗？</span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                立即体验 QuizzyFlow
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              加入数万用户的选择，让问卷设计变得简单高效
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-2xl transition-all duration-300"
              >
                免费开始使用
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-gray-700 hover:bg-white/20 transition-all duration-300"
              >
                查看演示
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Links Section */}
        <div className="relative py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
              {/* Brand */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <RocketOutlined className="text-white text-xl" />
                  </div>
                  <h3 className="text-white font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    QuizzyFlow
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                  新一代问卷低代码平台，让问卷设计简单高效，让数据洞察触手可及。专业工具，服务万千用户。
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: '𝕏', label: 'Twitter' },
                    { icon: '𝖌', label: 'GitHub' },
                    { icon: '𝖎𝖓', label: 'LinkedIn' }
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ y: -3, scale: 1.1 }}
                      className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-gray-700 transition-all duration-300"
                    >
                      <span className="text-lg">{social.icon}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Bar */}
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
