import {Button, Input, message} from "antd";
import otpImage from "../../assets/image/otp.png"
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import apiService from "../../service/ApiService.jsx";
import {updateStep} from "../../redux/fearture/RegistrationRequestSlice.jsx";
function VerifyOtp () {
    const email = useSelector(state => state.registrationRequest.email);
    const [otp,setOtp] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const onChange = (text) => {
        console.log('onChange:', text);
        setOtp(text)
    };

    const handleVerify = async ()=>{
        messageApi.open({
            key:"verify-otp",
            type: 'loading',
            content: 'Loading...',
        });
        const data = {
            otp:otp,
            email:email
        }
        try {
            const response = await apiService.put("otp/verify",data)
            if(!response.success){
                console.log(response)
                messageApi.open({
                    key:"verify-otp",
                    type: 'error',
                    content: response.message,
                });
            }
            else {
                messageApi.open({
                    key:"send-request",
                    type: 'success',
                    content: "Xác thực thành công !",
                });
                dispatch(updateStep(2));

            }
        }
        catch (error){
            console.log(error.response)
        }
    }


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
                <Input.OTP  size="large" length={5} value={otp} onChange={onChange} />
            </div>
            <div>
                <Button disabled={otp.length !== 5} onClick={handleVerify}>
                    Xác thực
                </Button>
            </div>
            {contextHolder}
        </div>
    )
}

export default VerifyOtp;