import {Button, Card, ConfigProvider, Form, Input, message, Modal, Popconfirm, Spin, Typography} from "antd";
import {CloseOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import ApiService from "../../service/ApiService.jsx";
import {getErrorMessage} from "../../utils/MessageError.jsx";
import React, {useState} from "react";
import MapWithWaypoints from "../../page/MapWithWayPoints.jsx";

function DetailTourPackageForm(props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingDelete,setLoadingDelete] = useState(false)
    const [isFetching, setIsFetching] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState(null);
    const [waypointsData, setWaypointsData] = useState([]);
    const [currentData, setCurrentData] = useState(props.currentData);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [variant, setVariant] = useState("borderless")
    const [listDetailedItineraryDelete, setListDetailedItineraryDelete] = useState([]);
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
        const data = {
            tourPackage,
            detailedItinerary,
            listIdDelete: listDetailedItineraryDelete
        }

        try {
            const response = await ApiService.put("/tour-package/update", data)
            if (response) {
                props.refreshData()
                setCurrentData(props.form)
                setListDetailedItineraryDelete([])
                messageApi.open({
                    key: "send-request",
                    type: 'success',
                    content: 'Cập nhật gói tour thành công!',
                });
            }
        } catch (error) {
            messageApi.open({
                key: "send-request",
                type: 'error',
                content: 'Cập nhật gói tour thất bại!',
            });
            setErrorMessage(getErrorMessage(error.response.data.errorCode))
        }
    };

    const openModal = (dayIndex) => {
        const detailedItinerary = props.form.getFieldValue('detailedItinerary') || [];
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
        const detailedItinerary = props.form.getFieldValue('detailedItinerary') || [];
        const updatedItinerary = [...detailedItinerary];
        updatedItinerary[currentDayIndex] = {
            ...updatedItinerary[currentDayIndex],
            wayPoints: newWaypoints // Lưu dưới dạng JSON string
        };
        props.form.setFieldsValue({ detailedItinerary: updatedItinerary });
        closeModal();
    };


    const confirmDeleteTourPackage = async () => {
        messageApi.open({
            key: "delete-tour-package",
            type: 'loading',
            content: 'Loading...',
        });
        const param = {
            tourPackageId: currentData.tourPackage.id
        }
        try {
            const response = await ApiService.delete("/tour-package/delete", param)
            if (response) {
                props.refreshData()
                props.closeModal()
                messageApi.open({
                    key: "delete-tour-package",
                    type: 'success',
                    content: 'Xóa gói tour thành công!',
                });
            }
        } catch (error) {
            messageApi.open({
                key: "delete-tour-package",
                type: 'error',
                content: 'Xóa gói tour thất bại!',
            });
        }
    }

    const onFinishFailed = (errorInfo) => {
        setErrorMessage("")
    };

    const turnOnEditMode = () => {
        setIsEdit(true)
        setVariant("outlined")
    }

    const turnOffEditMode = () => {
        props.form.setFieldsValue(currentData)
        setListDetailedItineraryDelete([])
        setIsEdit(false)
        setVariant("borderless")
    }

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
                    <Input readOnly={!isEdit} variant={variant}/>
                </Form.Item>

                <Form.Item
                    label="Tên gói tour"
                    name={["tourPackage", "tourName"]}
                    rules={[{required: true, message: "Tên gói không được để trống"}]}
                >
                    <Input readOnly={!isEdit} variant={variant}/>
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name={["tourPackage", "price"]}
                    rules={[{required: true, message: "Giá không được để trống"}]}
                >
                    <Input readOnly={!isEdit} variant={variant}/>
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name={["tourPackage", "description"]}
                    rules={[{required: true, message: "Mô tả không được để trống"}]}
                >
                    <Input.TextArea rows={4} readOnly={!isEdit} variant={variant}/>
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
                            {fields.map((field,index) => (
                                <Card
                                    className="my-2"
                                    key={field.key + 1}
                                    size="small"
                                    title={`Ngày ${field.name + 1}`}
                                    extra={isEdit ?
                                        <CloseOutlined onClick={() => {
                                            const currentItinerary = props.form.getFieldValue("detailedItinerary");
                                            if (currentItinerary[field.name]) {
                                                setListDetailedItineraryDelete([...listDetailedItineraryDelete, currentItinerary[field.name].id])
                                            }
                                            remove(field.name)
                                        }
                                        }/> : <div/>
                                    }
                                >
                                    <Form.Item
                                        {...field}
                                        label="Di chuyển từ"
                                        name={[field.name, "from"]}
                                        rules={[{required: true, message: "Không được để trống"}]}
                                    >
                                        <Input readOnly={!isEdit} variant={variant}/>
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        label="Đến"
                                        name={[field.name, "to"]}
                                        rules={[{required: true, message: "Không được để trống"}]}
                                    >
                                        <Input readOnly={!isEdit} variant={variant}/>
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        label="Mô tả"
                                        name={[field.name, "description"]}
                                        rules={[{required: true, message: "Không được để trống"}]}
                                    >
                                        <Input.TextArea rows={3} readOnly={!isEdit} variant={variant}/>
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
                                        style={{ display: 'none' }}
                                    >
                                        <Input.TextArea />
                                    </Form.Item>
                                </Card>
                            ))}
                            {isEdit ?
                                <Button type="dashed" onClick={() => add()} block>
                                    + Thêm Ngày
                                </Button>
                                :
                                ''
                            }

                            {/* Hiển thị lỗi nếu toàn bộ Form.List không hợp lệ */}
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
                {!isEdit ?
                    <span className="flex flex-row gap-4 justify-center items-center w-full">
                        <Form.Item className="flex justify-center">
                            <Button className="my-4" onClick={turnOnEditMode}>
                                Chỉnh sửa
                            </Button>
                        </Form.Item>
                        <Form.Item className="flex justify-center">
                            <ConfigProvider theme={{token: {colorPrimary: '#ff0000'},}}>
                                <Popconfirm
                                    title="Xóa gói tour"
                                    description={`Bạn có chắc chắn muốn xóa gói : ${props.currentData?.tourPackage?.id ?? ''} - ${props.currentData?.tourPackage?.tourName ?? ''} ?`}
                                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                    // open={open}
                                    // onOpenChange={handleOpenChange}
                                    onConfirm={confirmDeleteTourPackage}
                                    // onCancel={cancel}
                                    okText="Xóa"
                                    cancelText="Không"
                                >
                                    <Button danger>Xóa gói</Button>
                                </Popconfirm>
                            </ConfigProvider>
                        </Form.Item>
                    </span>
                    :
                    <div className="flex flex-row gap-4 justify-center items-center w-full">
                        <Form.Item>
                            <Button htmlType="submit" type="primary" className="my-4" onClick={() => {
                                console.log("===========listDelete", listDetailedItineraryDelete)
                            }}>
                                Cập nhật
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button className="my-4" onClick={turnOffEditMode}>
                                Hủy
                            </Button>
                        </Form.Item>
                    </div>
                }
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

export default DetailTourPackageForm;
