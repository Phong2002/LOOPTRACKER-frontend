import {Button, Form, Input, Select} from "antd";
import ImageUploadButton from "../common/ImageUploadButton.jsx";
import {useDispatch, useSelector} from 'react-redux';
import {
    addFileCCCDInputFront,
    addFileCCCDInputBack,
    addFileGPLXInputFront,
    addFileGPLXInputBack,
    updateData,
} from "../../redux/fearture/RegistrationRequestSlice.jsx"

function RegisterRequestForm() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.registrationRequest);

    const onFinish = (values) => {
        dispatch(updateData(values))
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className=" w-full">

            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={data}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 20,
                }}
                layout="horizontal"
            >
                <div
                    className="flex flex-row w-full items-center justify-around"
                >
                    <div className="w-[45%] h-full">
                        <Form.Item label="Họ"
                                   name="lastName"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Họ không được để trống"
                                       },
                                   ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Tên đệm và tên"
                                   name="firsName"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Tên đệm và tên không được để trống"
                                       },
                                   ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Tỉnh"
                                   name="province"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Tỉnh không được để trống"
                                       },
                                   ]}>
                            <Select>
                                <Select.Option value="demo">Demo</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Huyện"
                                   name="district"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Huyện không được để trống"
                                       },
                                   ]}>
                            <Select>
                                <Select.Option value="demo">Demo</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Xã"
                                   name="ward"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Xã không được để trống"
                                       },
                                   ]}>
                            <Select>
                                <Select.Option value="demo">Demo</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Email"
                                   name="email"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Email không được để trống"
                                       },
                                   ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Số điện thoại"
                                   name="phoneNumber"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Số điện thoại không được để trống"
                                       },
                                   ]}>
                            <Input/>
                        </Form.Item>

                    </div>
                    <div className="w-[45%] h-full ">
                        <Form.Item label="Số căn CCCD"
                                   name="cccd"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Số căn cước công dân không được để trống"
                                       },
                                   ]}>
                            <Input/>
                        </Form.Item>
                        <div className="flex flex-row justify-around  mb-4">
                            <div>
                                <label>
                                    Mặt trước CCCD
                                </label>
                                <div>
                                    <ImageUploadButton inputId="fileCCCDInputFront"
                                                       onImageChange={(value) => dispatch(addFileCCCDInputFront(value))}
                                                       value={data.fileCCCDInputFront}
                                    />
                                </div>
                            </div>

                            <div>
                                <label>
                                    Mặt sau CCCD
                                </label>
                                <div>
                                    <ImageUploadButton inputId="fileCCCDInputBack"
                                                       onImageChange={(value) => dispatch(addFileCCCDInputBack(value))}
                                                       value={data.fileCCCDInputBack}
                                    />


                                </div>
                            </div>
                        </div>

                        <Form.Item label="Số GPLX "
                                   name="gplx"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Số giấy phép lái xe không được để trống"
                                       },
                                   ]}>
                            <Input/>
                        </Form.Item>

                        <div className="flex flex-row justify-around mb-4">
                            <div>
                                <label>
                                    Mặt trước GPLX
                                </label>
                                <div>
                                    <ImageUploadButton inputId="fileGPLXInputFront"
                                                       onImageChange={(value) => dispatch(addFileGPLXInputFront(value))}
                                                       value={data.fileGPLXInputFront}

                                    />
                                </div>
                            </div>

                            <div>
                                <label>
                                    Mặt sau GPLX
                                </label>
                                <div>
                                    <ImageUploadButton inputId="fileGPLXInputBack"
                                                       onImageChange={(value) => dispatch(addFileGPLXInputBack(value))}
                                                       value={data.fileGPLXInputBack}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button htmlType="submit">Gửi yêu cầu đăng ký</Button>
            </Form>
        </div>
    )
}

export default RegisterRequestForm;