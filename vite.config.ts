import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteImagemin from 'vite-plugin-imagemin'
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * 配置文档: https://vite.dev/config/
*/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
    }),
    visualizer({
      open: true, // 构建后自动打开分析报告
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  /**
   * 路径别名配置
   * @ -> src 目录
   */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
      }
  },
  /**
   * 
  */
  build: {
    // 输出目录
    outDir: 'dist',
    // 静态资源目录
    assetsDir: 'assets',
    // chunk 大小警告限制（kb）
    chunkSizeWarningLimit: 1000,
    // 启用/禁用 CSS 代码拆分
    cssCodeSplit: true,
    // 代码分割策略
    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Redux 相关
          'redux-vendor': ['react-redux', '@reduxjs/toolkit', 'redux-undo'],
          
          // Ant Design UI 库
          'antd-vendor': ['antd', '@ant-design/icons'],
          
          // 图表库
          'chart-vendor': ['recharts'],
          
          // 工具库
          'utils-vendor': ['axios', 'lodash-es', 'nanoid', 'ahooks'],
          
          // 拖拽相关
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          
          // 动画库
          'animation-vendor': ['framer-motion'],
        },
        
        // 静态资源文件命名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      },
    },
    // 压缩配置
    minify: 'esbuild',
    // 生成 sourcemap
    sourcemap: false, // 生产环境关闭以减小体积
    // 启用 gzip 压缩大小报告
    reportCompressedSize: true,
    // 启用/禁用 CSS 压缩
    cssMinify: true,
    // Rollup 监听配置
    watch: null,
    // 构建后清空输出目录
    emptyOutDir: true,
    // 静态资源处理
    assetsInlineLimit: 4096, // 小于 4kb 的资源内联为 base64
  },
  /**
   * Esbuild 配置
  */
  esbuild: {
    // 移除 console 和 debugger
    drop: ['console', 'debugger'],
    // 生产环境移除所有注释
    legalComments: 'none',
  },
  /**
   * 依赖优化
  */
  optimizeDeps: {
    // 明确需要预构建的依赖
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      '@ant-design/icons',
      'axios',
      'lodash-es',
      'recharts',
      '@reduxjs/toolkit',
      'react-redux',
    ],
    
    // 排除预构建的依赖
    exclude: [],
    
    // 强制预构建链接的包
    force: false,
  },
  /**
   * CSS 优化
  */
  css: {
    // CSS 模块配置
    modules: {
      localsConvention: 'camelCase',
    },
    // PostCSS 配置
    postcss: './postcss.config.ts',
    // 开发环境下的 CSS sourcemap
    devSourcemap: false,
    // CSS 预处理器配置（使用 到了 SCSS/LESS 再配置）
    preprocessorOptions: {

    },
  },
  /**
   * Vite 开发服务器配置
   * 端口: 8000
   * 代理: /api -> http://localhost:3000
   */
  server: {
    port: 8000,
    open: true,

    // 预热常用文件（加快首次访问）
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/router/index.tsx',
      ],
    },

    // HMR 配置
    hmr: {
      overlay: true, // 显示错误覆盖层
    },

    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
