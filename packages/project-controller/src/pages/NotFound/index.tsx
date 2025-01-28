import React from "react"
import { useNavigate } from "react-router-dom";
import { Result, Button } from "antd"

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." extra={<Button type="primary" onClick={() => navigate("/")}>返回首页</Button>} />
    )
}

export default NotFound