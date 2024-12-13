// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import {Button, ConfigProvider, notification} from "antd";
import apiService from "../../service/ApiService.jsx";
import {useNavigate} from "react-router-dom";
import {BellOutlined} from "@ant-design/icons";
function LoginForm() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message,setMessage] = useState('')
    const [api, contextHolder] = notification.useNotification();
    const handleLogin = async () => {
        if(!validateForm()){
            return
        }
        try {
            const user = {
                username:username,
                password:password
            }
            const data = await apiService.post("/auth/login",user);
            console.log(data)
            if(data.role === "ADMIN" || data.role === "MANAGER"){
                navigate("../")
            }
            else {
                api.open({
                    message: 'Thông báo',
                    description:
                        `Xin chào ${data.lastName} ${data.firstName}, hiện tại vai trò của bạn chưa đủ quyền để truy cập trang web này, vui lòng tải ứng dụng LoopTracker để sử dụng các dịch vụ được cung cấp !`,
                    icon: <BellOutlined style={{ color: '#ffc900' }} />,
                    showProgress: true,
                    duration:10
                });
            }
        } catch (error) {
            if(error.status == 401){
                setMessage("Sai tài khoản hoặc mật khẩu")
            }
        }
    };

    const validateForm=()=>{
        setMessage('')
        if(username == '' && password == ''){
            setMessage("Vui lòng nhập tài khoản và mật khẩu !")
            return false
        }
        else if(username == ''){
            setMessage("Vui lòng nhập tài khoản !")
            return false
        }
        else if(password == ''){
            setMessage("Vui lòng nhập mật khẩu !")
            return false
        }
        return true

    }

return (
    <div className="w-full flex flex-col ">
        <div className="flex flex-col items-start w-full mb-[20px]">
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
        <div className="h-[40px] flex justify-center items-center text-red-500">
            {message}
        </div>
        <div>
            <ConfigProvider theme={{token: {colorPrimary: '#00c259'},}}>
                <Button type="primary" className="w-[250px] h-[40px] rounded-3xl text-[18px]" onClick={handleLogin} >Đăng nhập</Button>
            </ConfigProvider>
        </div>
        {contextHolder}
    </div>
)
}

export default LoginForm;