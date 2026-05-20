import { Link } from 'react-router-dom'
import { cn } from '@/utils'

interface HomeHeaderProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

const HomeHeader = ({ onLoginClick, onRegisterClick }: HomeHeaderProps) => {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
      <Link
        to="/"
        className="font-mono text-sm tracking-[0.2em] text-zinc-400 no-underline transition-colors hover:text-[var(--cyber-accent)]"
      >
        QuizzyFlow
      </Link>

      <nav className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
        <button
          type="button"
          onClick={onLoginClick}
          className={cn(
            'px-4 py-2 text-zinc-500 transition-colors',
            'hover:text-[var(--cyber-accent)]'
          )}
        >
          Login
        </button>
        <button
          type="button"
          onClick={onRegisterClick}
          className={cn(
            'home-cyber-glow border border-[var(--cyber-accent-dim)] px-4 py-2',
            'text-[var(--cyber-accent)] transition-colors',
            'hover:bg-[rgba(0,229,255,0.06)]'
          )}
        >
          Register
        </button>
      </nav>
    </header>
  )
}

export default HomeHeader
