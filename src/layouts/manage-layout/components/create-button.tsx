import React from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface ICreateButtonProps {
  loading: boolean
  onClick: () => void
}

const CreateButton: React.FC<ICreateButtonProps> = ({ loading, onClick }) => {
  const { primaryColor, themeColors } = useTheme()

  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-0 md:gap-2 px-2 md:px-3 h-8 md:h-9 rounded-lg text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.background = `linear-gradient(135deg, ${themeColors.primaryHover}, ${primaryColor})`
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
        }
      }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
      ) : (
        <Plus className="w-4 h-4" strokeWidth={2} />
      )}
    </button>
  )
}

export default CreateButton