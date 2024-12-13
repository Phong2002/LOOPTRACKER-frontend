import {Button, Card, Form, Input, message, Typography} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import ApiService from "../../service/ApiService.jsx";
import {getErrorMessage} from "../../utils/MessageError.jsx";
import {useState} from "react";

function TourPackageCreationForm(props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [errorMessage, setErrorMessage] = useState("");
    const onFinish = async (values) => {
        setErrorMessage("")
        messageApi.open({
            key: "send-request",
            type: 'loading',
            content: 'Loading...',
        });

        const tourPackage = {
            ...values.tourPackage,
            day: values.detailedItinerary.length,
            night: values.detailedItinerary.length - 1
        }
        let detailedItinerary = values.detailedItinerary

        detailedItinerary.forEach((item, index) => {
            item.day = index + 1;
        })
        const data = {tourPackage, detailedItinerary}
        try {
            const response = await ApiService.post("/tour-package/create", data)
            if (response) {
                props.refreshData();
                messageApi.open({
                    key: "send-request",
                    type: 'success',
                    content: 'Thêm gói tour mới thành công!',
                });
            }
        } catch (error) {
            console.log("=============================", error)
            messageApi.open({
                key: "send-request",
                type: 'error',
                content: 'Thêm gói tour mới thất bại!',
            });
            setErrorMessage(getErrorMessage(error.response.data.errorCode))
        }
    };

    const onFinishFailed = (errorInfo) => {
        setErrorMessage("")
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="overflow-y-scroll h-[500px]">
            <Form
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                form={props.form}
                name="tour_package_form"
                style={{maxWidth: 800}}
                className="px-2"
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={(errorInfo) => {
                    onFinishFailed(errorInfo)
                    message.error("Vui lòng kiểm tra lại các trường bị lỗi.");
                }}
            >
                <Form.Item
                    label="Mã gói tour"
                    name={["tourPackage", "id"]}
                    rules={[{required: true, message: "ID không được để trống"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Tên gói tour"
                    name={["tourPackage", "tourName"]}
                    rules={[{required: true, message: "Tên gói không được để trống"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name={["tourPackage", "price"]}
                    rules={[{required: true, message: "Giá không được để trống"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name={["tourPackage", "description"]}
                    rules={[{required: true, message: "Mô tả không được để trống"}]}
                >
                    <Input.TextArea/>
                </Form.Item>

                <div className="font-semibold text-neutral-800">Lịch trình chi tiết</div>

                <Form.List
                    name="detailedItinerary"
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                        {
                            validator: async (_, value) => {
                                if (!value || value.length === 0) {
                                    return Promise.reject(new Error("Không được để trống lịch trình."));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, {add, remove}, {errors}) => (
                        <>
                            {fields.map((field) => (
                                <Card
                                    className="my-2"
                                    key={field.key}
                                    size="small"
                                    title={`Ngày ${field.name + 1}`}
                                    extra={
                                        <CloseOutlined onClick={() => remove(field.name)}/>
                                    }
                                >
                                    <Form.Item
                                        {...field}
                                        label="Di chuyển từ"
                                        name={[field.name, "from"]}
                                        rules={[{required: true, message: "Không được để trống"}]}
                                    >
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        label="Đến"
                                        name={[field.name, "to"]}
                                        rules={[{required: true, message: "Không được để trống"}]}
                                    >
                                        <Input/>
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        label="Mô tả"
                                        name={[field.name, "description"]}
                                        rules={[{required: true, message: "Không được để trống"}]}
                                    >
                                        <Input.TextArea/>
                                    </Form.Item>
                                </Card>
                            ))}

                            <Button type="dashed" onClick={() => add()} block>
                                + Thêm Ngày
                            </Button>
                            <Form.ErrorList className="flex justify-center text-red-500" errors={errors}/>
                        </>
                    )}
                </Form.List>
                {/*<Form.Item noStyle shouldUpdate>*/}
                {/*    {() => (*/}
                {/*        <Typography>*/}
                {/*            <pre>{JSON.stringify(props.form.getFieldsValue(), null, 2)}</pre>*/}
                {/*        </Typography>*/}
                {/*    )}*/}
                {/*</Form.Item>*/}
                <div className="flex justify-center items-center text-red-500">
                    {errorMessage}
                </div>
                <Form.Item className="flex justify-center">
                    <Button htmlType="submit" type="primary" className="my-4">
                        Gửi yêu cầu đăng ký
                    </Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
}

export default TourPackageCreationForm;
