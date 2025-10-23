import { createBrowserRouter } from 'react-router-dom'
import HomeLayout from '@/layouts/home-layout'
import ManageLayout from '@/layouts/manage-layout'
import QuestionLayout from '@/layouts/question-layout'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Register from '@/pages/register'
import ForgotPassword from '@/pages/forgot-password'
import Terms from '@/pages/terms'
import Privacy from '@/pages/privacy'
import NotFound from '@/pages/not-found'
import Dashboard from '@/pages/manage/dashboard'
import List from '@/pages/manage/list'
import Trash from '@/pages/manage/trash'
import Star from '@/pages/manage/star'
import Edit from '@/pages/question/edit'
import Statistics from '@/pages/question/statistics'
import Publish from '@/pages/question/publish'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
    ],
  },
  {
    path: '/question',
    element: <QuestionLayout />,
    children: [
      {
        path: 'edit/:id',
        element: <Edit />,
      },
      {
        path: 'statistics/:id',
        element: <Statistics />,
      },
      {
        path: 'publish/:id',
        element: <Publish />,
      },
    ],
  },
  {
    path: 'manage',
    element: <ManageLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'list',
        element: <List />,
      },
      {
        path: 'star',
        element: <Star />,
      },
      {
        path: 'trash',
        element: <Trash />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
