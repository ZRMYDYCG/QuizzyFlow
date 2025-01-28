import { Layout, Dropdown, Button, Menu, Drawer } from 'antd'
import { useMediaQuery } from 'react-responsive'
import { DownOutlined, MenuOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useRef } from 'react'
import useScroll from '../../../../hooks/useScroll.ts'

const { Header } = Layout

const HeaderComponent: React.FC = () => {
    const [surveyMenuVisible, setSurveyMenuVisible] = useState(false)
    const [serviceMenuVisible, setServiceMenuVisible] = useState(false)
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
    const [headerBackground, setHeaderBackground] = useState('transparent')

    const headerRef = useRef<HTMLDivElement | null>(null)
    const documentRef = useRef<Document>(document)

    useScroll(documentRef, 30,
        () => {
            setHeaderBackground('white')
        },
        () => {
            setHeaderBackground('transparent')
        }
    );

    const menuItems = [
        { label: '问卷调查', key: 'survey' },
        { label: '在线考试', key: 'exam' },
        { label: '360度评估', key: 'evaluation' },
        { label: '报告套餐', key: 'report' },
        { label: '在线测评', key: 'online-assessment' },
        { label: '在线投票', key: 'vote' }
    ]

    const serviceItems = [
        { label: '用户体系', key: 'user-system' },
        { label: '打卡接龙', key: 'check-in' },
        { label: '人才盘点', key: 'talent-assessment' },
        { label: '员工体验管理', key: 'employee-experience' },
        { label: '客户体验管理', key: 'customer-experience' },
    ]

    const renderMenu = (items: { label: string, key: string }[]) => (
        <Menu items={items} className="p-4 grid grid-cols-3 gap-4" />
    )

    const renderMobileMenu = () => (
        <Menu
            mode="inline"
            items={[
                {
                    label: '应用展示',
                    key: 'survey-menu',
                    children: menuItems.map(item => ({
                        label: item.label,
                        key: item.key,
                    })),
                },
                {
                    label: '企业服务',
                    key: 'service-menu',
                    children: serviceItems.map(item => ({
                        label: item.label,
                        key: item.key,
                    })),
                },
                { label: '样本服务', key: 'samples' },
                { label: '问卷模板', key: 'templates' },
                { label: '解决方案', key: 'solutions' },
                { label: '咨询', key: 'consult' },
                { label: '登录', key: 'login' },
                {
                    label: (
                        <Button type="primary">免费使用</Button>
                    ),
                    key: 'free-use',
                },
            ]}
        />
    )

    const isMobile = useMediaQuery({ maxWidth: 768 })

    // 使用 useEffect 监听 isMobile 的变化
    useEffect(() => {
        if (!isMobile && mobileMenuVisible) {
            setMobileMenuVisible(false);
        }
    }, [isMobile, mobileMenuVisible]);

    return (
        <Header ref={headerRef} className="px-8 fixed top-0 w-full z-[66] transition-background duration-300" style={{ backgroundColor: headerBackground }}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <div className="text-xl text-black">
                        <img src="/public/vite.svg" alt="Logo" className="inline-block h-10"/>
                        一刻问卷星
                    </div>

                    {!isMobile && (
                        <div className="space-x-6 text-black">
                            <Dropdown
                                overlay={renderMenu(menuItems)}
                                trigger={['click']}
                                onOpenChange={setSurveyMenuVisible}
                            >
                                <Button type="text" className="hover:text-blue-500 cursor-pointer">
                                    应用展示 <DownOutlined className={`${surveyMenuVisible ? 'rotate-180' : ''} transition-transform duration-300`}/>
                                </Button>
                            </Dropdown>
                            <Dropdown
                                overlay={renderMenu(serviceItems)}
                                trigger={['click']}
                                onOpenChange={setServiceMenuVisible}
                            >
                                <Button type="text" className="hover:text-blue-500 cursor-pointer">
                                    企业服务 <DownOutlined className={`${serviceMenuVisible ? 'rotate-180' : ''} transition-transform duration-300`}/>
                                </Button>
                            </Dropdown>
                            <Button type="text" className="hover:text-blue-500 cursor-pointer">样本服务</Button>
                            <Button type="text" className="hover:text-blue-500 cursor-pointer">问卷模板</Button>
                            <Button type="text" className="hover:text-blue-500 cursor-pointer">解决方案</Button>
                        </div>
                    )}
                </div>
                <div>
                    {!isMobile && (
                        <>
                            <Button type="link" className="text-black">咨询</Button>
                            <Button type="link" className="text-black">登录</Button>
                            <Button type="primary" className="ml-2">免费使用</Button>
                        </>
                    )}
                    {isMobile && (
                        <Button type="text" onClick={() => setMobileMenuVisible(true)}>
                            <MenuOutlined />
                        </Button>
                    )}
                </div>
            </div>
            <Drawer
                title="菜单"
                placement="left"
                onClose={() => setMobileMenuVisible(false)}
                visible={mobileMenuVisible}
            >
                {renderMobileMenu()}
            </Drawer>
        </Header>
    )
}

export default HeaderComponent
