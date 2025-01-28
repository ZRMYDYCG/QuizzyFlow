import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <div>MainLayout Header</div>
            <div>
                <Outlet />
            </div>
            <div>MainLayout Footer</div>
        </>
    )
}

export default MainLayout