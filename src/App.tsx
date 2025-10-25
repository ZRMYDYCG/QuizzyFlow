import { RouterProvider } from 'react-router-dom'
import routerConfig from './router'
import { ThemeProvider } from './contexts/ThemeContext'
import useLoadUserData from './hooks/useLoadUserData'
import AntdThemeProvider from './components/antd-theme-provider'

function App() {
  // 初始化用户数据
  useLoadUserData()

  return (
    <ThemeProvider>
      <AntdThemeProvider>
        <RouterProvider router={routerConfig} />
      </AntdThemeProvider>
    </ThemeProvider>
  )
}

export default App
