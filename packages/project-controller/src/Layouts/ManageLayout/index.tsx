import { Outlet } from "react-router-dom";

const ManageLayout = () => {
    return (
        <div className="flex py-[24px] w-[1200px] m-auto">
            <div className="w-[120px]">
                <p>ManageLayout left</p>
                <button>创建问卷</button>
                <button>星标问卷</button>
                <button>回收站</button>
            </div>
            <div className="flex-1 ml-[60px]">
                <Outlet />
            </div>
        </div>
    )
}

export default ManageLayout