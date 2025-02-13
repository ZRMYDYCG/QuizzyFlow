import React, { useState } from 'react'

const Hero: React.FC = () => {
  const [showMore, setShowMore] = useState(false)

  const items = [
    { id: 1, title: '问卷调查', icon: 'path/to/icon1.png' },
    { id: 2, title: '在线考试', icon: 'path/to/icon2.png' },
    { id: 3, title: '报名表单', icon: 'path/to/icon3.png' },
    { id: 4, title: '360度评估', icon: 'path/to/icon4.png' },
    { id: 5, title: '在线投票', icon: 'path/to/icon5.png' },
    { id: 6, title: '在线反馈', icon: 'path/to/icon6.png' },
    { id: 7, title: '心理测评', icon: 'path/to/icon7.png' },
    { id: 8, title: '职业测评', icon: 'path/to/icon8.png' },
    { id: 9, title: '兴趣测评', icon: 'path/to/icon9.png' },
  ]

  const displayedItems = showMore ? items : items.slice(0, 3)

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        问卷星可满足您各类问卷/表单需求
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayedItems.map((item) => (
          <div key={item.id} className="relative w-full pb-full">
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-center bg-white border border-gray-300 rounded-lg">
              <div>
                <img src={item.icon} alt={item.title} className="mb-2" />
                <p>{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!showMore && (
        <button
          onClick={() => setShowMore(true)}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          更多应用
        </button>
      )}
    </div>
  )
}

export default Hero
