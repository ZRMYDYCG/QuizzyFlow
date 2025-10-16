import { useEffect, useRef, useState } from 'react';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import ScrollIndicator from './ScrollIndicator';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

const HeroSection = ({ onRegisterClick, onLoginClick }: HeroSectionProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // 鼠标移动效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / 20,
          y: (e.clientY - rect.top - rect.height / 2) / 20
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <HeroBackground mousePosition={mousePosition} />
      <HeroContent onRegisterClick={onRegisterClick} onLoginClick={onLoginClick} />
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;

