import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import {Button, Space, Divider, message} from "antd"
import { PlusOutlined, BranchesOutlined, StarOutlined, DeleteOutlined } from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import { createQuestion } from "../../api/modules/question.ts"
import { useRequest } from "ahooks"

const ManageLayout = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const { loading, run: handleCreate } = useRequest(createQuestion, {
        manual: true,
        onSuccess: async (res) => {
            const { id } = res || {}

            if(id) {
                navigate(`/question/edit/${id}`)
                message.success('创建成功')
            }
        },
    })
    return (
        <div>
            <Header />
            <div className="flex py-[24px] w-full max-w-[1200px] m-auto">
                <div className="w-[120px]">
                    <Space direction="vertical" className="sticky top-10">
                        <Button
                            type="primary"
                            size="large" icon={<PlusOutlined />}
                            onClick={handleCreate}
                            disabled={loading}
                        >
                            新建问卷
                        </Button>
                        <Divider />
                        <Button
                            type={pathname.startsWith('/manage/list')? 'primary' : 'default'}
                            size="large" icon={<BranchesOutlined />}
                            onClick={() => navigate('/manage/list')}
                        >
                            我的问卷
                        </Button>
                        <Button
                            type={pathname.startsWith('/manage/star')? 'primary' : 'default'}
                            size="large" icon={<StarOutlined />}
                            onClick={() => navigate('/manage/star')}
                        >
                            星标问卷
                        </Button>
                        <Button
                            type={pathname.startsWith('/manage/trash')? 'primary' : 'default'}
                            size="large" icon={<DeleteOutlined />}
                            onClick={() => navigate('/manage/trash')}
                        >
                            回收站
                        </Button>
                    </Space>
                </div>
                <div className="flex-1 ml-[60px]">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ManageLayout;
