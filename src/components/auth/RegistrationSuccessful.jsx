import Fireworks from "../common/FireWork.jsx";
import {CheckCircleFilled} from "@ant-design/icons";

function RegistrationSuccessful() {
    return (
        <div>
            <div>
                <div>
                    <CheckCircleFilled className="text-green-500 text-[120px]" size={100}/>
                </div>
                <div className="text-green-700 text-[30px] font-semibold">
                    Gửi đơn đăng ký thành công
                </div>
                <div className="flex justify-center text-blue-950">

                <div className=" w-[680px]">
                <div className=" leading-relaxed text-left">
                    Chúng tôi rất vui mừng thông báo rằng đơn đăng ký của bạn đã được nhận. Chúng tôi sẽ xem xét và phản
                    hồi lại kết quả trong thời gian sớm nhất thông qua email mà bạn đã đăng ký.
                    <br/>
                    Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi.
                    <br/>
                   <i>
                       Trân trọng,<br/>
                       Đội ngũ LoopTracker
                   </i>
                </div>
                </div>
                </div>
            </div>
            <Fireworks duration={5000} density={200} speed={500} />
        </div>
    )
}

export default RegistrationSuccessful;