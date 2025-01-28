import {Link, useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    }
    return (
        <div>
            <p>Home</p>
            <div>
                <button onClick={handleLogin}>登录</button>
                <Link to="/register">注册</Link>
            </div>
        </div>
    )
}

export default Home