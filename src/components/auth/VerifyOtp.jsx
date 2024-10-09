import {Button, Input} from "antd";
import otpImage from "../../assets/image/otp.png"
import {useSelector} from "react-redux";
function VerifyOtp () {
    const email = useSelector(state => state.registrationRequest.email);

    const onChange = (text) => {
        console.log('onChange:', text);
    };
    const sharedProps = {
        onChange,
    };


    return(
        <div className="flex flex-col justify-center items-center gap-[10px]">
            <div>
                <img src={otpImage} alt="Otp Image" className="w-[300px]" />
            </div>
            <div className="text-indigo-900">
                <div className="inline ">
                    Bạn vui lòng nhập mã xác thực chúng tôi vừa gửi về địa chỉ email :
                </div>
                {email}
            </div>
            <div>
                <Input.OTP  size="large" length={6} {...sharedProps} />
            </div>
            <div>
                <Button>
                    Xác thực
                </Button>
            </div>
        </div>
    )
}

export default VerifyOtp;