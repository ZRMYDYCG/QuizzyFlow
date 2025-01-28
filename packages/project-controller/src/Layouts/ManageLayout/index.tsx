import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { Button, Space, Divider } from "antd";
import { PlusOutlined, BranchesOutlined, StarOutlined, DeleteOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";

const ManageLayout = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Header />
            <div className="flex py-[24px] w-full max-w-[1200px] m-auto">
                <div className="w-[120px]">
                    <Space direction="vertical" className="sticky top-10">
                        <Button type="primary" size="large" icon={<PlusOutlined />}>新建问卷</Button>
                        <Divider />
                        <Button type="default" size="large" icon={<BranchesOutlined />} onClick={() => navigate('/manage/list')}>我的问卷</Button>
                        <Button type="default" size="large" icon={<StarOutlined />} onClick={() => navigate('/manage/star')}>星标问卷</Button>
                        <Button type="default" size="large" icon={<DeleteOutlined />} onClick={() => navigate('/manage/trash')}>回收站</Button>
                    </Space>
                </div>
                <div className="flex-1 ml-[60px]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default ManageLayout;
