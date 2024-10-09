// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import {Button, ConfigProvider} from "antd";
import apiService from "../../service/ApiService.jsx";
function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {
        try {
            const user = {
                username:username,
                password:password
            }
            const data = await apiService.post("/auth/login",user);
            console.log(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

return (
    <div className="w-full flex flex-col gap-[20px]">
        <div className="flex flex-col items-start w-full ">
            <label className="pl-1">Tài khoản</label>
            <input value={username}
                   onChange={e=>setUsername(e.target.value)}
                   className="w-full h-[40px] rounded-[30px] text-black pl-3 pr-3 bg-white/80 !outline-none"/>
        </div>
        <div className="flex flex-col items-start w-full ">
            <label className="pl-1">Mật khẩu</label>
            <input value={password}
                   onChange={e=>setPassword(e.target.value)}
                   className="w-full h-[40px] rounded-[30px] text-black pl-3 pr-3 bg-white/80 !outline-none"/>
        </div>
        <div>
            <ConfigProvider theme={{token: {colorPrimary: '#00c259'},}}>
                <Button type="primary" className="w-[250px] h-[40px] rounded-3xl text-[18px]" onClick={handleLogin} >Đăng nhập</Button>
            </ConfigProvider>
        </div>
    </div>
)
}

export default LoginForm;