import { Layout } from 'antd'
import React from 'react'

const { Footer } = Layout

const FooterComponent: React.FC = () => {
    return (
        <Footer className="bg-gray-900 text-white p-8">
            <div className="max-w-screen-lg mx-auto flex flex-col lg:flex-row justify-between">
                {/* 左侧联系信息 */}
                <div className="mb-4 lg:mb-0">
                    <div className="flex items-center mb-2">
                        <img src="/public/vite.svg" alt="Logo" className="h-10"/>
                    </div>
                    <p>电话：400-993-5858</p>
                    <p>邮箱：cs@wjx.cn</p>
                    <p>广告合作</p>
                </div>

                {/* 右侧链接部分 */}
                <div className="flex flex-wrap">
                    <div className="mr-8 mb-4">
                        <h5 className="font-bold">产品</h5>
                        <ul>
                            <li><a href="#" className="hover:underline">企业标准版</a></li>
                            <li><a href="#" className="hover:underline">企业管家版</a></li>
                            <li><a href="#" className="hover:underline">企业旗舰版</a></li>
                            <li><a href="#" className="hover:underline">样本服务</a></li>
                            <li><a href="#" className="hover:underline">企业微信</a></li>
                            <li><a href="#" className="hover:underline">应用场景</a></li>
                        </ul>
                    </div>
                    <div className="mr-8 mb-4">
                        <h5 className="font-bold">客户</h5>
                        <ul>
                            <li><a href="#" className="hover:underline">客户展示</a></li>
                            <li><a href="#" className="hover:underline">最新消息</a></li>
                            <li><a href="#" className="hover:underline">媒体报道</a></li>
                        </ul>
                    </div>
                    <div className="mr-8 mb-4">
                        <h5 className="font-bold">支持</h5>
                        <ul>
                            <li><a href="#" className="hover:underline">客服中心</a></li>
                            <li><a href="#" className="hover:underline">帮助中心</a></li>
                            <li><a href="#" className="hover:underline">开放平台</a></li>
                            <li><a href="#" className="hover:underline">知识库</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold">关于我们</h5>
                        <ul>
                            <li><a href="#" className="hover:underline">关于我们</a></li>
                            <li><a href="#" className="hover:underline">加入我们</a></li>
                            <li><a href="#" className="hover:underline">产品动态</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-screen-lg mx-auto mt-8 py-4 text-center text-sm text-gray-400 border-t">
                <p>一刻问卷星信息科技有限公司  版权所有  ICP证湘B2-20240508</p>
                <p>湘ICP备1700336号-1  湘公网安备 4301900200223245号  备案举报</p>
            </div>
        </Footer>
    )
}

export default FooterComponent
