import React from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import { createQuestion } from '@/api/modules/question'

const CreateButton: React.FC = () => {
  const navigate = useNavigate()
  const { primaryColor, themeColors } = useTheme()

  const { loading, run: handleCreate } = useRequest(
    async () => {
      const res = await createQuestion()
      return res
    },
    {
      manual: true,
      onSuccess: async (res) => {
        const { _id } = res || {}
        
        if (_id) {
          message.success('问卷创建成功')
          navigate(`/question/edit/${_id}`)
        }
      },
      onError: () => {
      },
    }
  )

  return (
    <button 
      onClick={handleCreate}
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