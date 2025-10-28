import { lazy, Suspense } from 'react'
import { Spin } from 'antd'
import AdminLayout from '@/layouts/admin-layout'
import { PermissionGuard } from '@/components/permission-guard'
import { PERMISSIONS } from '@/constants/permissions'
import { ROLES } from '@/constants/roles'

// 懒加载管理后台页面
const Dashboard = lazy(() => import('@/pages/admin/dashboard'))
const UsersManagement = lazy(() => import('@/pages/admin/users'))
const RolesManagement = lazy(() => import('@/pages/admin/roles'))
const PermissionsManagement = lazy(() => import('@/pages/admin/permissions'))
const QuestionsManagement = lazy(() => import('@/pages/admin/questions'))
const LogsManagement = lazy(() => import('@/pages/admin/logs'))
const SystemSettings = lazy(() => import('@/pages/admin/settings'))
const AdminNotFound = lazy(() => import('@/pages/admin/not-found'))

// 模板管理相关页面
const TemplatesLayout = lazy(() => import('@/pages/admin/templates'))
const TemplateList = lazy(() => import('@/pages/admin/templates/list'))
const TemplateReview = lazy(() => import('@/pages/admin/templates/review'))
const TemplateCategories = lazy(() => import('@/pages/admin/templates/categories'))
const TemplateStatistics = lazy(() => import('@/pages/admin/templates/statistics'))

// 答卷管理相关页面
const AnswersLayout = lazy(() => import('@/pages/admin/answers'))
const AnswerList = lazy(() => import('@/pages/admin/answers/list'))
const AnswerStatistics = lazy(() => import('@/pages/admin/answers/statistics'))

// 内容审核相关页面
const ModerationLayout = lazy(() => import('@/pages/admin/moderation'))
const ModerationQueue = lazy(() => import('@/pages/admin/moderation/queue'))
const SensitiveWords = lazy(() => import('@/pages/admin/moderation/sensitive-words'))
const ModerationStatistics = lazy(() => import('@/pages/admin/moderation/statistics'))

// 反馈管理相关页面
const FeedbackLayout = lazy(() => import('@/pages/admin/feedback'))
const FeedbackList = lazy(() => import('@/pages/admin/feedback/list'))
const FeedbackStatistics = lazy(() => import('@/pages/admin/feedback/statistics'))

// 加载组件
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" tip="加载中..." />
  </div>
)

/**
 * 管理后台路由配置
 */
export const adminRoutes = {
  path: 'admin',
  element: <AdminLayout />,
  children: [
    {
      path: 'dashboard',
      element: (
        <PermissionGuard role={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'users',
      element: (
        <PermissionGuard permission={PERMISSIONS.USER_VIEW_ALL}>
          <Suspense fallback={<LoadingFallback />}>
            <UsersManagement />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'roles',
      element: (
        <PermissionGuard permission={PERMISSIONS.ROLE_VIEW}>
          <Suspense fallback={<LoadingFallback />}>
            <RolesManagement />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'permissions',
      element: (
        <PermissionGuard permission={PERMISSIONS.PERMISSION_VIEW}>
          <Suspense fallback={<LoadingFallback />}>
            <PermissionsManagement />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'questions',
      element: (
        <PermissionGuard permission={PERMISSIONS.QUESTION_VIEW_ALL}>
          <Suspense fallback={<LoadingFallback />}>
            <QuestionsManagement />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'logs',
      element: (
        <PermissionGuard permission={PERMISSIONS.SYSTEM_LOGS_VIEW}>
          <Suspense fallback={<LoadingFallback />}>
            <LogsManagement />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'settings',
      element: (
        <PermissionGuard permission={PERMISSIONS.SYSTEM_CONFIG_VIEW}>
          <Suspense fallback={<LoadingFallback />}>
            <SystemSettings />
          </Suspense>
        </PermissionGuard>
      ),
    },
    {
      path: 'templates',
      element: (
        <PermissionGuard role={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <Suspense fallback={<LoadingFallback />}>
            <TemplatesLayout />
          </Suspense>
        </PermissionGuard>
      ),
      children: [
        {
          path: 'list',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <TemplateList />
            </Suspense>
          ),
        },
        {
          path: 'review',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <TemplateReview />
            </Suspense>
          ),
        },
        {
          path: 'categories',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <TemplateCategories />
            </Suspense>
          ),
        },
        {
          path: 'statistics',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <TemplateStatistics />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: 'answers',
      element: (
        <PermissionGuard role={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <Suspense fallback={<LoadingFallback />}>
            <AnswersLayout />
          </Suspense>
        </PermissionGuard>
      ),
      children: [
        {
          path: 'list',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <AnswerList />
            </Suspense>
          ),
        },
        {
          path: 'statistics',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <AnswerStatistics />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: 'moderation',
      element: (
        <PermissionGuard role={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <Suspense fallback={<LoadingFallback />}>
            <ModerationLayout />
          </Suspense>
        </PermissionGuard>
      ),
      children: [
        {
          path: 'queue',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <ModerationQueue />
            </Suspense>
          ),
        },
        {
          path: 'sensitive-words',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <SensitiveWords />
            </Suspense>
          ),
        },
        {
          path: 'statistics',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <ModerationStatistics />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: 'feedback',
      element: (
        <PermissionGuard role={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <Suspense fallback={<LoadingFallback />}>
            <FeedbackLayout />
          </Suspense>
        </PermissionGuard>
      ),
      children: [
        {
          path: 'list',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <FeedbackList />
            </Suspense>
          ),
        },
        {
          path: 'statistics',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <FeedbackStatistics />
            </Suspense>
          ),
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

