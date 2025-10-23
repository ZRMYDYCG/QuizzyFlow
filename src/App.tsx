import { RouterProvider } from 'react-router-dom'
import routerConfig from './router'
import { ThemeProvider } from './contexts/ThemeContext'
import useLoadUserData from './hooks/useLoadUserData'

function App() {
  // 初始化用户数据
  useLoadUserData()

  return (
    <ThemeProvider>
      <RouterProvider router={routerConfig} />
    </ThemeProvider>
  )
}

export default App
