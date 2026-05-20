import { useNavigate } from 'react-router-dom'
import { CyberBackdrop, HomeFooter, HomeHeader, HomeHero } from './components'
import './home.css'

const Home = () => {
  const navigate = useNavigate()

  const handleRegisterClick = () => navigate('/register')
  const handleLoginClick = () => navigate('/login')

  return (
    <div className="home-cyber relative flex min-h-screen flex-col overflow-hidden bg-[var(--cyber-bg)] text-zinc-300 selection:bg-[rgba(0,229,255,0.2)] selection:text-white">
      <CyberBackdrop />
      <HomeHeader onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <HomeHero onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <HomeFooter />
    </div>
  )
}

export default Home
