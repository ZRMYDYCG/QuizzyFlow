import { motion } from 'framer-motion';
import { RocketOutlined } from '@ant-design/icons';

const FooterBrand = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-2"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          <RocketOutlined className="text-white text-xl" />
        </div>
        <h3 className="text-white font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          QuizzyFlow
        </h3>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
        新一代问卷低代码平台，让问卷设计简单高效，让数据洞察触手可及。专业工具，服务万千用户。
      </p>
      <div className="flex gap-3">
        {[
          { icon: '𝕏', label: 'Twitter' },
          { icon: '𝖌', label: 'GitHub' },
          { icon: '𝖎𝖓', label: 'LinkedIn' }
        ].map((social, i) => (
          <motion.a
            key={i}
            href="#"
            whileHover={{ y: -3, scale: 1.1 }}
            className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-gray-700 transition-all duration-300"
          >
            <span className="text-lg">{social.icon}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default FooterBrand;

