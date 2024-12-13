import {useNavigate} from "react-router-dom";
import loginBackground from "../../assets/background/login-bg.jpg";
import {CommentOutlined, FileDoneOutlined, LeftOutlined, SolutionOutlined} from "@ant-design/icons";
import RegisterRequestForm from "../../components/auth/RegistrationRequestForm.jsx";
import {Steps} from "antd";
import {useDispatch, useSelector} from "react-redux";
import VerifyOtp from "../../components/auth/VerifyOtp.jsx";
import RegistrationSuccessful from "../../components/auth/RegistrationSuccessful.jsx";
import {updateStep} from "../../redux/fearture/RegistrationRequestSlice.jsx";

function RegistrationRequestPage(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const data = useSelector(state => state.registrationRequest);
    const backgroundImageStyle = {
        backgroundImage: `
        linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08)), 
        url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        color: 'white',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    };

    const blurOverlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: 'blur(3px)',
        zIndex: 0,
    };

    const process = [<RegisterRequestForm key={1} />,<VerifyOtp key={2} />,<RegistrationSuccessful key={3} />];

    return (
        <div style={backgroundImageStyle}>
            <div style={blurOverlayStyle}></div>
            <div
                className="flex flex-col gap-[30px] items-center bg-white/90 w-[1000px] h-[650px] rounded-[15px] p-[10px]"
                style={{zIndex: 1}}>
                <div className="flex justify-between items-center w-full">
                    <div className="text-blue-700 font-medium cursor-pointer select-none"
                         onClick={() => navigate('/login')}>
                        <LeftOutlined/>
                        Đăng nhập
                    </div>
                    <div className="flex-1 text-center font-bold text-2xl text-green-700">
                        Đăng ký trở thành Easy Rider
                    </div>

                </div>
                <div className="w-full flex flex-col gap-[15px]" >
                    <div className="mx-[30px]">
                        <Steps
                            items={[
                                {
                                    title: 'Thông tin cá nhân',
                                    icon: <SolutionOutlined className="select-none" onClick={()=>dispatch(updateStep(0))}/>,
                                },
                                {
                                    title: 'Xác thực',
                                    icon: <CommentOutlined onClick={data.stepOpen>=1? ()=>dispatch(updateStep(1)):null}/>,
                                },
                                {
                                    title: 'Hoàn thành',
                                    icon: <FileDoneOutlined className="select-none"  onClick={data.stepOpen>=2? ()=>dispatch(updateStep(2)):null}/>,
                                },
                            ]}
                            current={data.step}
                        />
                    </div>
                    {process[data.step]}
                </div>
            </div>
        </div>
    )
}

export default RegistrationRequestPage;