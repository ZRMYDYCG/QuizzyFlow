import React from 'react'
import { Button } from 'antd'
import VideoCover from '../../../../assets/Home/video-cover.png'
import VideoSrc from '../../../../assets/Home/banner.mp4'
import BannerBg from '../../../../assets/Home/banner.png'

const Banner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-[130px] text-white relative" style={{ backgroundImage: `url(${BannerBg})` }}>
            <div className="relative z-10 text-center">
                <h1 className="text-4xl font-bold mb-4">开启调研新时代</h1>
                <p className="text-lg mb-6">AI覆盖问卷工作全流程，大幅提升调研质量</p>
                <div className="flex justify-center">
                    <Button type="primary" className="mr-3" size="large">立即体验AI</Button>
                    <Button type="text" size="large">进入工作台</Button>
                </div>
            </div>
            <div className="relative z-10 mt-6 w-full max-w-5xl">
                <video
                    src={VideoSrc}
                    poster={VideoCover}
                    className="w-full max-w-5xl rounded-lg shadow-lg"
                    controls
                >
                    您的浏览器不支持 video 标签。
                </video>
            </div>
        </div>
    )
}

export default Banner
