import { Outlet } from "react-router-dom";
import useLoadUserData from "../../hooks/useLoadUserData.ts";
import useNavPage from "../../hooks/useNavPage.ts";
import {Spin} from "antd";

const QuestionLayout = () => {
    const { waitingUserData } = useLoadUserData()
    useNavPage(waitingUserData)
    return (
        <div className="h-screen">
            {waitingUserData ? (
                <div style={{ textAlign: "center", marginTop: "60px" }}>
                    <Spin />
                </div>
            ) : (
                <Outlet />
            )}
        </div>
    )
}

export default QuestionLayout