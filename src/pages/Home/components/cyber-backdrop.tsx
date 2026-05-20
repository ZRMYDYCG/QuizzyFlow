const CyberBackdrop = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="home-cyber-grid absolute inset-0" />
      <div className="home-cyber-vignette absolute inset-0" />
      <div
        className="absolute left-1/2 top-[38%] h-px w-[min(90vw,640px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--cyber-accent)] to-transparent opacity-40 home-cyber-pulse"
      />
      <div className="home-cyber-scanline absolute inset-0" />
    </div>
  )
}

export default CyberBackdrop
