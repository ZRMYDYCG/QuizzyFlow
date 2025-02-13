import { createBrowserRouter } from 'react-router-dom'

import HomeLayout from '../Layouts/HomeLayout'
import ManageLayout from '../Layouts/ManageLayout'
import QuestionLayout from '../Layouts/QuestionLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import NotFound from '../pages/NotFound'
import List from '../pages/Manage/List'
import Trash from '../pages/Manage/Trash'
import Star from '../pages/Manage/Star'
import Edit from '../pages/Question/Edit'
import Statistics from '../pages/Question/Statistics'

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
