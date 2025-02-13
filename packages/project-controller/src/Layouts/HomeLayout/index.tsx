import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import useLoadUserData from '../../hooks/useLoadUserData.ts'
import useNavPage from '../../hooks/useNavPage.ts'

const { Content } = Layout

const HomeLayout: React.FC = () => {
  const { waitingUserData } = useLoadUserData()
  useNavPage(waitingUserData)

  return (
    <Layout>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}

export default HomeLayout
