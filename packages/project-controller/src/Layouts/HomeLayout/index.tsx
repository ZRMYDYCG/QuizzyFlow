import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const { Content } = Layout;

const HomeLayout: React.FC = () => {
    return (
        <Layout>
            <Header />
            <Content>
                <Outlet />
            </Content>
            <Footer />
        </Layout>
    );
}

export default HomeLayout;
