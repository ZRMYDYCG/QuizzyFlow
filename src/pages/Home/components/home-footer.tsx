import { Link } from 'react-router-dom'

const HomeFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-900/80 px-6 py-6 font-mono text-[10px] tracking-wider text-zinc-600 md:flex-row md:px-10">
      <span>© {year} QuizzyFlow</span>
      <div className="flex gap-6 uppercase">
        <Link to="/terms" className="transition-colors hover:text-[var(--cyber-accent)]">
          Terms
        </Link>
        <Link to="/privacy" className="transition-colors hover:text-[var(--cyber-accent)]">
          Privacy
        </Link>
      </div>
    </footer>
  )
}

export default HomeFooter
