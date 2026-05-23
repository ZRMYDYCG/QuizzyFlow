import React, { lazy, Suspense } from 'react'
import AdminLayout from '@/layouts/admin-layout'
import { PermissionGuard } from '@/components/permission-guard'
import { LoadingSpin } from '@/components/loading-spin'

const Dashboard = lazy(() => import('@/pages/admin/dashboard'))
const UsersManagement = lazy(() => import('@/pages/admin/users'))
const RolesManagement = lazy(() => import('@/pages/admin/roles'))
const PermissionsManagement = lazy(() => import('@/pages/admin/permissions'))
const QuestionsManagement = lazy(() => import('@/pages/admin/questions'))
const LogsManagement = lazy(() => import('@/pages/admin/logs'))
const SystemSettings = lazy(() => import('@/pages/admin/settings'))
const AdminNotFound = lazy(() => import('@/pages/admin/not-found'))

const TemplatesLayout = lazy(() => import('@/pages/admin/templates'))
const TemplateList = lazy(() => import('@/pages/admin/templates/list'))
const TemplateReview = lazy(() => import('@/pages/admin/templates/review'))
const TemplateCategories = lazy(() => import('@/pages/admin/templates/categories'))
const TemplateStatistics = lazy(() => import('@/pages/admin/templates/statistics'))

const AnswersLayout = lazy(() => import('@/pages/admin/answers'))
const AnswerList = lazy(() => import('@/pages/admin/answers/list'))
const AnswerStatistics = lazy(() => import('@/pages/admin/answers/statistics'))

const ModerationLayout = lazy(() => import('@/pages/admin/moderation'))
const ModerationQueue = lazy(() => import('@/pages/admin/moderation/queue'))
const SensitiveWords = lazy(() => import('@/pages/admin/moderation/sensitive-words'))
const ModerationStatistics = lazy(() => import('@/pages/admin/moderation/statistics'))

const FeedbackLayout = lazy(() => import('@/pages/admin/feedback'))
const FeedbackList = lazy(() => import('@/pages/admin/feedback/list'))
const FeedbackStatistics = lazy(() => import('@/pages/admin/feedback/statistics'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpin tip="加载中..." />
  </div>
)

const withRouteGuard = (route: string, element: React.ReactNode) => (
  <PermissionGuard route={route}>
    <Suspense fallback={<LoadingFallback />}>{element}</Suspense>
  </PermissionGuard>
)

/**
 * 管理后台路由（仅按路由守卫；按钮权限由页面内 PermissionControl 控制）
 */
export const adminRoutes = {
  path: 'admin',
  element: <AdminLayout />,
  children: [
    {
      path: 'dashboard',
      element: withRouteGuard('/admin/dashboard', <Dashboard />),
    },
    {
      path: 'users',
      element: withRouteGuard('/admin/users', <UsersManagement />),
    },
    {
      path: 'roles',
      element: withRouteGuard('/admin/roles', <RolesManagement />),
    },
    {
      path: 'permissions',
      element: withRouteGuard('/admin/permissions', <PermissionsManagement />),
    },
    {
      path: 'questions',
      element: withRouteGuard('/admin/questions', <QuestionsManagement />),
    },
    {
      path: 'logs',
      element: withRouteGuard('/admin/logs', <LogsManagement />),
    },
    {
      path: 'settings',
      element: withRouteGuard('/admin/settings', <SystemSettings />),
    },
    {
      path: 'templates',
      element: withRouteGuard('/admin/templates', <TemplatesLayout />),
      children: [
        {
          path: 'list',
          element: withRouteGuard('/admin/templates/list', <TemplateList />),
        },
        {
          path: 'review',
          element: withRouteGuard('/admin/templates/review', <TemplateReview />),
        },
        {
          path: 'categories',
          element: withRouteGuard('/admin/templates/categories', <TemplateCategories />),
        },
        {
          path: 'statistics',
          element: withRouteGuard('/admin/templates/statistics', <TemplateStatistics />),
        },
      ],
    },
    {
      path: 'answers',
      element: withRouteGuard('/admin/answers', <AnswersLayout />),
      children: [
        {
          path: 'list',
          element: withRouteGuard('/admin/answers/list', <AnswerList />),
        },
        {
          path: 'statistics',
          element: withRouteGuard('/admin/answers/statistics', <AnswerStatistics />),
        },
      ],
    },
    {
      path: 'moderation',
      element: withRouteGuard('/admin/moderation', <ModerationLayout />),
      children: [
        {
          path: 'queue',
          element: withRouteGuard('/admin/moderation/queue', <ModerationQueue />),
        },
        {
          path: 'sensitive-words',
          element: withRouteGuard('/admin/moderation/sensitive-words', <SensitiveWords />),
        },
        {
          path: 'statistics',
          element: withRouteGuard('/admin/moderation/statistics', <ModerationStatistics />),
        },
      ],
    },
    {
      path: 'feedback',
      element: withRouteGuard('/admin/feedback', <FeedbackLayout />),
      children: [
        {
          path: 'list',
          element: withRouteGuard('/admin/feedback/list', <FeedbackList />),
        },
        {
          path: 'statistics',
          element: withRouteGuard('/admin/feedback/statistics', <FeedbackStatistics />),
        },
      ],
    },
    {
      path: '*',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminNotFound />
        </Suspense>
      ),
    },
  ],
}
