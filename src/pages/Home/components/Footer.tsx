import { motion } from 'framer-motion';
import FooterCTA from './FooterCTA';
import FooterBrand from './FooterBrand';
import FooterBottom from './FooterBottom';

interface FooterProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

const Footer = ({ onRegisterClick, onLoginClick }: FooterProps) => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-400 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* CTA Section */}
      <FooterCTA onRegisterClick={onRegisterClick} onLoginClick={onLoginClick} />

      {/* Links Section */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <FooterBrand />
          </div>

          <FooterBottom />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

