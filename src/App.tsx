import { RouterProvider } from 'react-router-dom'
import routerConfig from './router'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={routerConfig} />
    </ThemeProvider>
  )
}

export default App
