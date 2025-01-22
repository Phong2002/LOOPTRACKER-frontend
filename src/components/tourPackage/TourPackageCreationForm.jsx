// TourPackageCreationForm.js
import React, { useState } from 'react';
import {Form, Input, Button, Card, Modal, Typography, message, Dropdown, Menu, Spin} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import MapWithWaypoints from "../../page/MapWithWayPoints.jsx";
import ApiService from "../../service/ApiService.jsx";
import {getErrorMessage} from "../../utils/MessageError.jsx";

function TourPackageCreationForm(props) {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState(null);
    const [waypointsData, setWaypointsData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [errorMessage, setErrorMessage] = useState("");

    const openModal = (dayIndex) => {
        const detailedItinerary = form.getFieldValue('detailedItinerary') || [];
        console.log("==============detailedItinerary==",detailedItinerary)
        const currentWaypoints = detailedItinerary[dayIndex]?.wayPoints ?detailedItinerary[dayIndex].wayPoints : [];
        console.log("==============detailedItinerary[dayIndex]==",detailedItinerary[dayIndex])
        console.log("==============currentWaypoints==",currentWaypoints)

        setWaypointsData(currentWaypoints);
        setCurrentDayIndex(dayIndex);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const saveWaypoints = (newWaypoints) => {
        const detailedItinerary = form.getFieldValue('detailedItinerary') || [];
        const updatedItinerary = [...detailedItinerary];
        updatedItinerary[currentDayIndex] = {
            ...updatedItinerary[currentDayIndex],
            wayPoints: newWaypoints // Lưu dưới dạng JSON string
        };
        form.setFieldsValue({ detailedItinerary: updatedItinerary });
        closeModal();
    };

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
            item.wayPoints.forEach((waypoint, index) => {
                waypoint.index = index +1
            })
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
                form={form}
                name="tour_package_form"
                style={{ maxWidth: 800 }}
                className="px-2"
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Mã gói tour"
                    name={["tourPackage", "id"]}
                    rules={[{ required: true, message: "ID không được để trống" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Tên gói tour"
                    name={["tourPackage", "tourName"]}
                    rules={[{ required: true, message: "Tên gói không được để trống" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name={["tourPackage", "price"]}
                    rules={[{ required: true, message: "Giá không được để trống" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name={["tourPackage", "description"]}
                    rules={[{ required: true, message: "Mô tả không được để trống" }]}
                >
                    <Input.TextArea />
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
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                                <Card
                                    className="my-2"
                                    key={field.key + 1}
                                    size="small"
                                    title={`Ngày ${index + 1}`}
                                    extra={
                                        <CloseOutlined onClick={() => remove(field.name)}
                                                       style={{color: 'red', cursor: 'pointer'}}/>
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

                                    {/* Nút mở modal MapWithWaypoints */}
                                    <div className={"flex justify-center items-center"}>
                                        <Button
                                            type="primary"
                                            className={"w-24"}
                                            onClick={() => openModal(index)}
                                            block
                                        >
                                            Lộ trình chi tiết
                                        </Button>
                                    </div>

                                    {/* Trường lưu dữ liệu waypoint (ẩn) */}
                                    <Form.Item
                                        {...field}
                                        name={[field.name, "waypoints"]}
                                        style={{display: 'none'}}
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

                {/* Hiển thị thông tin form để kiểm tra */}
                {/*<Form.Item noStyle shouldUpdate>*/}
                {/*    {() => (*/}
                {/*        <Typography>*/}
                {/*        <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>*/}
                {/*        </Typography>*/}
                {/*    )}*/}
                {/*</Form.Item>*/}

                {/* Hiển thị thông báo lỗi */}
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

            {/* Modal chứa MapWithWaypoints */}
            <Modal
                title={`Lộ trình chi tiết cho Ngày ${currentDayIndex !== null ? currentDayIndex + 1 : ''}`}
                visible={isModalVisible}
                onCancel={closeModal}
                footer={[
                    <Button key="back" onClick={closeModal}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => saveWaypoints(waypointsData)}
                        disabled={isFetching}
                    >
                        Lưu
                    </Button>,
                ]}
                width={1000} // Tăng kích thước modal
                style={{ top: 20 }} // Đẩy modal xuống để tăng không gian hiển thị
                bodyStyle={{ height: '80vh', overflow: 'hidden', position: 'relative' }} // Đặt chiều cao của modal và ẩn cuộn
            >
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }} id="modal-content">
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        {isFetching && (
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <Spin /> Đang tải lộ trình...
                            </div>
                        )}
                        <MapWithWaypoints
                            initialWaypoints={waypointsData}
                            onWaypointsChange={setWaypointsData}
                            osrmServiceUrl="http://localhost:5000/route/v1"
                            profile="bike"
                            language="vi"
                            reverseGeocodingUrl="https://nominatim.openstreetmap.org/reverse"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default TourPackageCreationForm;
