import { Link } from 'react-router-dom'
import { cn } from '@/utils'

interface HomeHeroProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

const HomeHero = ({ onLoginClick, onRegisterClick }: HomeHeroProps) => {
  return (
    <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-4 text-center md:px-10">
      <p className="mb-6 font-mono text-[10px] tracking-[0.5em] text-zinc-600 uppercase">
        Survey · Compose · Analyze
      </p>

      <h1 className="mb-4 text-[clamp(2.5rem,10vw,5.5rem)] font-light leading-none tracking-[0.12em] text-white">
        QUIZZY
        <span className="text-[var(--cyber-accent)]">FLOW</span>
      </h1>

      <p className="max-w-md text-sm leading-relaxed text-zinc-500">
        拖拽编排问卷，实时回收数据。
      </p>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={onRegisterClick}
          className={cn(
            'home-cyber-glow min-w-[200px] border border-[var(--cyber-accent)] bg-[rgba(0,229,255,0.08)]',
            'px-8 py-3 font-mono text-xs tracking-[0.3em] text-[var(--cyber-accent)] uppercase',
            'transition-colors hover:bg-[rgba(0,229,255,0.14)]'
          )}
        >
          Start
        </button>
        <button
          type="button"
          onClick={onLoginClick}
          className={cn(
            'min-w-[200px] border border-zinc-800 px-8 py-3 font-mono text-xs tracking-[0.3em]',
            'text-zinc-500 uppercase transition-colors',
            'hover:border-zinc-600 hover:text-zinc-300'
          )}
        >
          Sign in
        </button>
      </div>

      <Link
        to="/feedback"
        className="mt-8 font-mono text-[10px] tracking-[0.35em] text-zinc-600 uppercase no-underline transition-colors hover:text-[var(--cyber-accent)]"
      >
        意见反馈
      </Link>
    </section>
  )
}

export default HomeHero
