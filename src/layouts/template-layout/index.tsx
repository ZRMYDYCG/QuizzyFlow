import React, { useEffect, useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'
import CommunityBackdrop from './components/community-backdrop'
import TemplateHeader from './components/template-header'

const TemplateLayout = () => {
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col',
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'
      )}
    >
      <CommunityBackdrop />
      <TemplateHeader />

      <main className="relative flex-1">
        <Outlet />
      </main>

      <ScrollRestoration />
    </div>
  )
}

export default TemplateLayout
