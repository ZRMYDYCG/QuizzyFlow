/**
 * 模板市场首页 - 英雄区组件
 */
import { FC } from 'react'
import { Search, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

interface HeroSectionProps {
  onSearch?: (keyword: string) => void
}

const HeroSection: FC<HeroSectionProps> = ({ onSearch }) => {
  const { theme, primaryColor, themeColors } = useTheme()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword') as string
    onSearch?.(keyword)
  }

  return (
    <div className="relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 渐变球体 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${primaryColor}, ${themeColors.primaryActive})`
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${themeColors.primaryActive}, ${primaryColor})`
          }}
        />
        
        {/* 网格背景 */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
              linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* 内容区 */}
      <div className="relative pt-16 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* 标题区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            {/* 小标题 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}10, ${themeColors.primaryActive}10)`,
                border: `1px solid ${primaryColor}20`
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
              <span className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
              }`}>
                精选模板市场
              </span>
            </motion.div>

            {/* 主标题 */}
            <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              发现
              <span 
                className="mx-3 bg-clip-text text-transparent bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
                }}
              >
                完美模板
              </span>
              <br className="hidden md:block" />
              快速创建问卷
            </h1>

            {/* 副标题 */}
            <p className={`text-lg md:text-xl mb-8 ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}>
              精美模板，覆盖 8+ 行业场景，开箱即用，一键创建
            </p>
          </motion.div>

          {/* 搜索框 */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className={`
              relative flex items-center gap-2 p-2 rounded-2xl backdrop-blur-md
              ${theme === 'dark' 
                ? 'bg-slate-800/50 border-2 border-slate-700' 
                : 'bg-white border-2 border-gray-200'
              }
              shadow-2xl focus-within:shadow-3xl transition-all duration-300
            `}
              style={{
                borderColor: theme === 'dark' ? `${primaryColor}20` : undefined
              }}
            >
              <Search className={`w-5 h-5 ml-3 ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                name="keyword"
                placeholder="搜索模板名称、标签、行业..."
                className={`
                  flex-1 px-2 py-3 bg-transparent outline-none text-base
                  ${theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-gray-900 placeholder:text-gray-400'}
                `}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
                }}
              >
                搜索
              </button>
            </div>
          </motion.form>

          {/* 统计数据 */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center gap-8 md:gap-12"
          >
            {[
              { icon: Sparkles, label: '精选模板', value: '1000+' },
              { icon: TrendingUp, label: '每日使用', value: '50K+' },
              { icon: Zap, label: '节省时间', value: '10分钟' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{
                    background: `${primaryColor}15`
                  }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <div className="text-left">
                  <div className={`text-xl md:text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div> */}
        </div>
      </div>
    </div>
  )
}

export default HeroSection

