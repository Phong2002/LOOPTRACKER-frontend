import {Button, Form, Input, message, Select} from "antd";
import ApiService from "../../service/ApiService.jsx";
import TextArea from "antd/es/input/TextArea.js";

function PassengerCreationForm(props) {
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        messageApi.open({
            key:"send-request",
            type: 'loading',
            content: 'Loading...',
        });
        try {
            const response = await ApiService.post("/passenger/create", values)
            if(response){
                props.refreshData()
                messageApi.open({
                    key:"send-request",
                    type: 'success',
                    content: 'Thêm hành khách mới thành công!',
                });
            }
        }
        catch (error){
            console.log("=============================",error)
            messageApi.open({
                key:"send-request",
                type: 'error',
                content: 'Thêm hành khách mới thất bại!',
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className=" w-full">
            <Form
                form={props.form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 20,
                }}
                layout="horizontal"
            >
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
                           name="firstName"
                           rules={[
                               {
                                   required: true,
                                   message: "Tên đệm và tên không được để trống"
                               },
                           ]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="Giới tính"
                           name="gender"
                           rules={[
                               {
                                   required: true,
                                   message: "Giới tính không được để trống"
                               },
                           ]}>
                    <Select
                        options={[
                            {value: 'MALE', label: 'Nam'},
                            {value: 'FEMALE', label: 'Nữ'},
                            {value: 'OTHER', label: 'Khác'},
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Email"
                           name="email"
                >
                    <Input/>
                </Form.Item>
                <Form.Item label="Số điện thoại"
                           name="phoneNumber"
                >
                    <Input/>
                </Form.Item>
                <Form.Item label="Ghi chú"
                           name="notes"
                >
                    <TextArea
                        placeholder="Vui lòng nhập ghi chú nếu có"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>
                <Form.Item className="flex justify-center">
                    <Button htmlType="submit " type="primary">Gửi yêu cầu đăng ký</Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    )
}

export default PassengerCreationForm;