import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import React from 'react'
import useLoadUserData from '../../hooks/useLoadUserData.ts'
import useNavPage from '../../hooks/useNavPage.ts'

const { Content } = Layout

const HomeLayout: React.FC = () => {
  const { waitingUserData } = useLoadUserData()
  useNavPage(waitingUserData)

  return (
    <Layout>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default HomeLayout
