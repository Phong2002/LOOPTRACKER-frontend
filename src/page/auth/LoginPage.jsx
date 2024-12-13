import loginBackground from '../../assets/background/login-bg.jpg';
import '../../style/auth.css';
import LoginForm from "../../components/auth/LoginForm.jsx";
import titleLogo from '../../assets/background/title-logo.png';
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
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

    return (
        <div style={backgroundImageStyle}>
            <div style={blurOverlayStyle}></div>
            <div className="flex flex-col gap-[80px] items-center" style={{ zIndex: 1 }}>
                <div>
                    <img src={titleLogo} className="h-[60px]" alt="Login" />
                </div>
                <div
                    className="w-[400px] h-[400px] bg-black/30
                    backdrop-blur-[4px] rounded-[60px]
                    flex flex-col justify-center items-center p-[50px] gap-[20px]"
                >
                    <LoginForm />
                    <div>
                        Bạn muốn trở thành Easy Rider?
                        <div
                            className="border border-white/80
                            text-white/80
                            rounded-2xl cursor-pointer
                            select-none
                            hover:border-white/100
                            hover:text-white/100
                            m-1"
                            onClick={() => navigate('/registration-request')}
                        >
                            Đăng ký ngay
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
