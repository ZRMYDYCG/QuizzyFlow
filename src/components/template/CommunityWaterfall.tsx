import { FC } from 'react'
import Masonry from 'react-masonry-css'
import { Eye, Heart } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils'
import type { CommunityTemplate } from '@/types/community-template'

interface CommunityWaterfallProps {
  templates: CommunityTemplate[]
  onPreview: (template: CommunityTemplate) => void
}

const breakpointColumns = {
  default: 4,
  1280: 3,
  768: 2,
  480: 1,
}

const CommunityWaterfall: FC<CommunityWaterfallProps> = ({ templates, onPreview }) => {
  const { theme } = useTheme()

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onPreview(template)}
          className={cn(
            'group mb-4 w-full overflow-hidden rounded-2xl border text-left transition-all',
            'hover:-translate-y-1 hover:shadow-xl',
            theme === 'dark'
              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              : 'border-gray-100 bg-white hover:border-gray-200'
          )}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ height: template.height }}
          >
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              style={{ background: template.cover }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="line-clamp-2 text-sm font-bold text-white">{template.title}</h3>
              <p className="mt-1 text-xs text-white/70">{template.author}</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[10px]',
                    theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              <span className="flex items-center gap-0.5">
                <Eye className="h-3 w-3" />
                {template.views}
              </span>
              <span className="flex items-center gap-0.5">
                <Heart className="h-3 w-3" />
                {template.likes}
              </span>
            </div>
          </div>
        </button>
      ))}
    </Masonry>
  )
}

export default CommunityWaterfall
