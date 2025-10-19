import { createBrowserRouter } from 'react-router-dom'
import HomeLayout from '@/layouts/home-layout'
import ManageLayout from '@/layouts/manage-layout'
import QuestionLayout from '@/layouts/question-layout'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import Terms from '@/pages/Terms'
import Privacy from '@/pages/Privacy'
import NotFound from '@/pages/NotFound'
import List from '@/pages/Manage/List'
import Trash from '@/pages/Manage/Trash'
import Star from '@/pages/Manage/Star'
import Edit from '@/pages/Question/Edit'
import Statistics from '@/pages/Question/Statistics'
import Publish from '@/pages/Question/Publish'

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
