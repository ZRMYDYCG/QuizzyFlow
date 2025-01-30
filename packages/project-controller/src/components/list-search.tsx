import React, {useEffect, useState} from 'react'
import { Input } from 'antd'
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const { Search } = Input

const ListSearch: React.FC = () => {
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()

  // 获取 Url 参数, 保持刷新后的 Input 值同步
  useEffect(() => {
      const newKeyword = searchParams.get('keyword')
      if (newKeyword) {
          setValue(newKeyword)
      }
  }, [searchParams])

  const handleSearch = (value: string) => {
      navigate(`${pathname}?keyword=${value}`)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
  }
  return <Search allowClear value={value} onChange={handleChange} placeholder="输入关键字" onSearch={handleSearch}></Search>
}

export default ListSearch
