import { Outlet } from "react-router-dom";

const QuestionLayout = () => {
    return (
        <div className="flex py-[24px] w-[1200px] m-auto">
            <div className="w-[120px]">QuestionLayout left</div>
            <div className="flex-1 ml-[60px]">
                <Outlet />
            </div>
        </div>
    )
}

export default QuestionLayout