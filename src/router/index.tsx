import { createBrowserRouter } from 'react-router-dom'
import HomeLayout from '@/layouts/home-layout'
import ManageLayout from '@/layouts/manage-layout'
import QuestionLayout from '@/layouts/question-layout'
import ProfileLayout from '@/layouts/profile-layout'
import FlowLayout from '@/layouts/flow-layout'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Register from '@/pages/register'
import ForgotPassword from '@/pages/forgot-password'
import Terms from '@/pages/terms'
import Privacy from '@/pages/privacy'
import NotFound from '@/pages/not-found'
import Forbidden from '@/pages/forbidden'
import Dashboard from '@/pages/manage/dashboard'
import List from '@/pages/manage/list'
import Trash from '@/pages/manage/trash'
import Star from '@/pages/manage/star'
import Edit from '@/pages/question/edit'
import Statistics from '@/pages/question/statistics'
import Publish from '@/pages/question/publish'
import TemplateMarket from '@/pages/template/market'
import TemplateDetail from '@/pages/template/detail'
import ProfileOverview from '@/pages/profile/overview'
import ProfileInfo from '@/pages/profile/info'
import ProfileSecurity from '@/pages/profile/security'
import ProfileStatistics from '@/pages/profile/statistics'
import ProfileSettings from '@/pages/profile/settings'
import DebugAuth from '@/pages/debug-auth'
import FlowList from '@/pages/flow/list'
import FlowEdit from '@/pages/flow/edit'
import { adminRoutes } from './admin-routes'

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
      {
        path: 'flow',
        element: <FlowList />,
      },
    ],
  },
  {
    path: 'template',
    element: <ManageLayout />,
    children: [
      {
        path: 'market',
        element: <TemplateMarket />,
      },
      {
        path: 'detail/:id',
        element: <TemplateDetail />,
      },
    ],
  },
  {
    path: 'flow',
    element: <FlowLayout />,
    children: [
      {
        path: 'edit/:id',
        element: <FlowEdit />,
      },
    ],
  },
  {
    path: 'profile',
    element: <ProfileLayout />,
    children: [
      {
        index: true,
        element: <ProfileOverview />,
      },
      {
        path: 'overview',
        element: <ProfileOverview />,
      },
      {
        path: 'info',
        element: <ProfileInfo />,
      },
      {
        path: 'security',
        element: <ProfileSecurity />,
      },
      {
        path: 'statistics',
        element: <ProfileStatistics />,
      },
      {
        path: 'settings',
        element: <ProfileSettings />,
      },
    ],
  },
  adminRoutes,
  {
    path: 'debug-auth',
    element: <DebugAuth />,
  },
  {
    path: '403',
    element: <Forbidden />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
