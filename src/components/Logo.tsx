import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { clsx } from 'clsx'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  onClick?: () => void
  className?: string
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  onClick,
  className 
}) => {
  const navigate = useNavigate()
  const { theme, primaryColor, themeColors } = useTheme()

  const sizes = {
    small: { icon: 'w-8 h-8', svg: 20, text: 'text-base', subtext: 'text-[9px]' },
    medium: { icon: 'w-10 h-10', svg: 24, text: 'text-lg', subtext: 'text-[10px]' },
    large: { icon: 'w-12 h-12', svg: 28, text: 'text-xl', subtext: 'text-xs' },
  }

  const currentSize = sizes[size]

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate('/manage')
    }
  }

  return (
    <div 
      className={clsx(
        'flex items-center gap-3 cursor-pointer group',
        className
      )}
      onClick={handleClick}
    >
      {/* Logo 图标 */}
      <div 
        className={clsx(
          currentSize.icon,
          'rounded-xl flex items-center justify-center',
          'transition-transform group-hover:scale-105'
        )}
      >
        <svg t="1761444617859" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10461" width="200" height="200"><path d="M519.3728 50.4832c2.8672 0.9216 5.8368 1.3312 8.3968 2.7648 10.752 5.12 22.8352 8.704 31.6416 16.0768 13.6192 11.3664 25.1904 25.2928 39.424 39.936-1.8432 1.024-4.608 1.9456-6.4512 3.7888a1758.4128 1758.4128 0 0 0-171.1104 189.8496c-35.5328 46.592-68.608 94.72-90.3168 149.6064-14.1312 35.84-23.552 72.704-26.5216 111.4112-1.536 20.48-0.2048 40.448 5.0176 60.0064a97.5872 97.5872 0 0 0 82.7392 72.3968c31.5392 4.8128 62.464 2.048 93.2864-4.4032 1.4336-0.3072 2.9696-0.3072 4.608-0.4096l1.3312 1.8432c-9.4208 8.9088-19.0464 17.8176-28.3648 27.0336-36.4544 36.4544-72.9088 72.9088-108.9536 109.568-5.3248 5.5296-8.2944 5.3248-13.5168 0-88.064-88.2688-176.3328-176.2304-264.3968-264.6016-31.232-31.1296-31.4368-74.9568-0.1024-106.2912C204.1856 330.6496 332.4928 202.5472 460.8 74.3424A72.704 72.704 0 0 1 500.0192 53.248c2.3552-0.512 4.608-1.8432 6.8608-2.7648h12.4928z" fill="#007BC6" p-id="10462"></path><path d="M506.88 973.5168c-3.072-0.8192-6.5536-1.1264-9.5232-2.4576-10.0352-4.608-21.2992-7.9872-29.5936-14.7456-11.776-9.8304-21.4016-22.4256-32.256-33.8944 12.6976-11.9808 26.7264-25.088 40.6528-38.4a1305.4976 1305.4976 0 0 0 160.0512-182.784c38.8096-54.4768 69.632-113.0496 87.04-177.8688 7.7824-29.0816 12.5952-58.368 10.4448-88.4736-4.096-53.0432-30.9248-93.9008-91.5456-106.8032a259.2768 259.2768 0 0 0-92.3648-0.512l134.9632-134.8608 3.6864 3.2768 260.4032 260.5056c33.792 33.6896 33.792 77.2096 0 110.8992L569.7536 946.688c-13.312 13.4144-28.3648 23.4496-47.7184 25.3952-1.024 0-1.8432 0.9216-2.56 1.4336H506.88z" fill="#005294" p-id="10463"></path><path d="M517.632 623.616L405.1968 511.0784l111.4112-116.3264L624.64 512c-36.0448 37.4784-71.8848 74.6496-107.008 111.616z" fill="#005194" p-id="10464"></path></svg>
      </div>
      
      {/* Logo 文字 */}
      {showText && (
        <div className="flex flex-col">
          <span className={clsx(
            currentSize.text,
            'font-bold tracking-tight',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            QuizzyFlow
          </span>
          <span className={clsx(
            currentSize.subtext,
            'font-medium tracking-wider',
            theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
          )}>
            你的问卷管家
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo

