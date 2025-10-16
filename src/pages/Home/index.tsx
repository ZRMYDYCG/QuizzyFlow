import { useNavigate } from 'react-router-dom';
import { HeroSection, FeaturesSection, Footer } from './components';

const Home = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => navigate('/register');
  const handleLoginClick = () => navigate('/login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      <HeroSection 
        onRegisterClick={handleRegisterClick}
        onLoginClick={handleLoginClick}
      />
      <FeaturesSection />
      <Footer 
        onRegisterClick={handleRegisterClick}
        onLoginClick={handleLoginClick}
      />
    </div>
  );
};

export default Home;
