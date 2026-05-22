import { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import Logo from '@/components/Logo'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'
import { TEMPLATE_FOOTER_SECTIONS } from '../config'

const TemplateFooter: FC = () => {
  const navigate = useNavigate()
  const { theme, primaryColor, themeColors } = useTheme()
  const year = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'relative mt-24 border-t',
        theme === 'dark' ? 'border-slate-800 bg-slate-950/50' : 'border-gray-200 bg-white/80'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Logo size="small" showText onClick={() => navigate('/template/market')} />
            <p
              className={cn(
                'mt-4 text-sm leading-relaxed',
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
              )}
            >
              QuizzyFlow 模板社区，发现、分享和使用高质量问卷模板。让创作更简单，让灵感流动起来。
            </p>

            <div
              className="mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}15, ${themeColors.primaryActive}15)`,
                color: primaryColor,
                border: `1px solid ${primaryColor}25`,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              社区持续开放中
            </div>
          </div>

          {TEMPLATE_FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3
                className={cn(
                  'mb-4 text-sm font-semibold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'inline-flex items-center gap-1 text-sm transition-colors',
                          theme === 'dark'
                            ? 'text-slate-400 hover:text-slate-200'
                            : 'text-gray-600 hover:text-gray-900'
                        )}
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={cn(
                          'text-sm transition-colors',
                          theme === 'dark'
                            ? 'text-slate-400 hover:text-slate-200'
                            : 'text-gray-600 hover:text-gray-900'
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={cn(
            'mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row',
            theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
          )}
        >
          <p className={cn('text-sm', theme === 'dark' ? 'text-slate-500' : 'text-gray-500')}>
            © {year} QuizzyFlow. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/terms"
              target="_blank"
              className={cn(
                'text-sm transition-colors',
                theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-gray-500 hover:text-gray-800'
              )}
            >
              服务条款
            </Link>
            <Link
              to="/privacy"
              target="_blank"
              className={cn(
                'text-sm transition-colors',
                theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-gray-500 hover:text-gray-800'
              )}
            >
              隐私政策
            </Link>
            <Link
              to="/feedback"
              className={cn(
                'text-sm transition-colors',
                theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-gray-500 hover:text-gray-800'
              )}
            >
              意见反馈
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default TemplateFooter
