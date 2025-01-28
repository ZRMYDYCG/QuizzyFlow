import React from 'react'
import { Button } from 'antd'
import VideoCover from '../../../../assets/Home/video-cover.png'
import VideoSrc from '../../../../assets/Home/banner.mp4'

const Banner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-white relative">
            <div className="relative z-10 text-center">
                <h1 className="text-4xl font-bold mb-4">开启调研新时代</h1>
                <p className="text-lg mb-6">AI覆盖问卷工作全流程，大幅提升调研质量</p>
                <div className="flex justify-center">
                    <Button type="primary" className="mr-3">立即体验AI</Button>
                    <Button type="default">进入工作台</Button>
                </div>
            </div>
            <div className="relative z-10 mt-6 w-full max-w-lg">
                <video
                    src={VideoSrc}
                    poster={VideoCover}
                    className="w-full rounded-lg shadow-lg"
                >
                </video>
            </div>
        </div>
    );
}

export default Banner;
