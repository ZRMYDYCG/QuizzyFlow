import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BannerBg from "../../assets/Home/banner.png"; // 引入本地图片

const { Content } = Layout;

const HomeLayout: React.FC = () => {
    return (
        <Layout>
            <div
                className="bg-cover bg-center h-screen"
                style={{ backgroundImage: `url(${BannerBg})` }}
            >
                <Header />
                <Content className="h-[calc(100vh-64px-71px)]">
                    <Outlet/>
                </Content>
            </div>

            <Footer />
        </Layout>
    );
}

export default HomeLayout;
