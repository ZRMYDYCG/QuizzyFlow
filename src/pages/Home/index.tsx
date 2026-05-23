import { useTitle } from 'ahooks'
import { useTheme } from '@/contexts/ThemeContext'
import CommunityBackdrop from '@/layouts/template-layout/components/community-backdrop'
import TemplateFooter from '@/layouts/template-layout/components/template-footer'
import { cn } from '@/utils'
import { LandingHeader, LandingHero, LandingShowcase } from './components'

const Home = () => {
  useTitle('QuizzyFlow - AI 问卷创作平台')
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col',
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'
      )}
    >
      <CommunityBackdrop />
      <LandingHeader />
      <main className="relative flex-1">
        <LandingHero />
        <LandingShowcase />
      </main>
      <TemplateFooter />
    </div>
  )
}

export default Home
