import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const CommunityBackdrop = () => {
  const { theme, primaryColor, themeColors } = useTheme()

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 right-[-8rem] h-[28rem] w-[28rem] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background: `radial-gradient(circle, ${primaryColor}, transparent 70%)`,
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [360, 180, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[-10rem] left-[-6rem] h-[24rem] w-[24rem] rounded-full opacity-[0.1] blur-3xl"
        style={{
          background: `radial-gradient(circle, ${themeColors.primaryActive}, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px),
            linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}

export default CommunityBackdrop
