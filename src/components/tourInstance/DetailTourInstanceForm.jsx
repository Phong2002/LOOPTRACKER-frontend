import {Button, Card, ConfigProvider, DatePicker, Form, Input, message, Popconfirm, Select, Typography} from "antd";
import {useEffect, useState} from "react";
import ApiService from "../../service/ApiService.jsx";
import '../../index.css'

const {RangePicker} = DatePicker;
import dayjs from 'dayjs';

import Icon, {CloseOutlined, DeleteFilled, DeleteOutlined, QuestionCircleOutlined} from "@ant-design/icons";

function DetailTourInstanceForm(props) {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [errorMessage, setErrorMessage] = useState("");
    const [currentData, setCurrentData] = useState();
    const [listTourPackage, setListTourPackage] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [listPassenger, setListPassenger] = useState([]);
    const [listTourGuides, setListTourGuides] = useState([]);
    const [listRiders, setListRiders] = useState([]);
    const vietnamLicensePlateRegex = /^\d{2}[A-Z,a-z]{1,2}\d?\s?-?\s?\d{3,5}(\.\d{2})?$/;
    const [isEdit, setIsEdit] = useState(false)
    const [listAssignmentIdDelete, setListAssignmentIdDelete] = useState([]);
    const [assignmentItemIdsDelete, setAssignmentItemIdsDelete] = useState([])

    const fetchTourInstance = async () => {
        const id = {
            tourInstanceId: props.tourInstanceId
        }
        try {
            const data = await ApiService.get("/tour-instance/details", id)
            console.log("======================data", data)
            const formData = {
                id: data.id,
                tourInstanceName: data.name,
                tourPackage: {
                    label: data.tourPackage.name,
                    value: data.tourPackage.id,
                    key: data.tourPackage.id
                },
                time: [
                    dayjs(data.startDate, "YYYY-MM-DD"),
                    dayjs(data.endDate, "YYYY-MM-DD"),
                ],
                tourGuide:
                    {
                        label: `${data?.tourGuide?.lastName ?? ''} ${data?.tourGuide?.firstName ?? ''}`,
                        value: data?.tourGuide?.id ?? '',
                        key: data?.tourGuide?.id ?? ''
                    },
                tourAssignments: data.tourAssignments?.map((tourAssignment) => {
                    return {
                        id: tourAssignment.id,
                        licensePlates: tourAssignment?.licensePlates,
                        passenger: {
                            label: `${tourAssignment.passenger.id} - ${tourAssignment.passenger.lastName} ${tourAssignment.passenger.firstName}`,
                            value: tourAssignment.passenger.id,
                            key: tourAssignment.passenger.id
                        },
                        rider: tourAssignment?.rider ? {
                            label: `${tourAssignment.rider.lastName} ${tourAssignment.rider.firstName} - ${tourAssignment.rider.username}`,
                            value: tourAssignment.rider.id,
                            key: tourAssignment.rider.id,
                        } : null,
                        listItems: tourAssignment?.assignmentItems ? tourAssignment?.assignmentItems.map(item => {
                                return {
                                    id: item.id,
                                    item: {
                                        label: item.item.name,
                                        value: item.item.id,
                                        key: item.item.id,
                                    },
                                    quantity: item.quantity
                                }
                            }
                        ) : []
                    }
                })
            }
            setCurrentData(formData)
            form.setFieldsValue(formData)
        } catch (e) {
            console.log(e)
        }
    }

    const onFinishToUpdate = async (values) => {
        setErrorMessage("")
        messageApi.open({
            key: "send-request-update",
            type: 'loading',
            content: 'Loading...',
        });

        let tourInstanceRequest = {
            id: props.tourInstanceId,
            tourPackage: values.tourPackage.value,
            name: values.tourInstanceName,
            tourGuide: values.tourGuide.value,
            startDate: values.time[0].format('YYYY-MM-DD'),
            endDate: values.time[1].format('YYYY-MM-DD'),
            tourAssignments: values.tourAssignments?.map((tourAssignment) => {
                return {
                    id: tourAssignment.id,
                    passenger: tourAssignment.passenger.value,
                    licensePlates: tourAssignment.licensePlates,
                    rider: tourAssignment?.rider?.value ?? '',
                    listItems: tourAssignment.listItems?.map((item) => {
                        return {
                            id: item.id,
                            itemId: item.item.value,
                            quantity: item.quantity,
                        }
                    }) ?? []
                }
            }) ?? []
        }
        const listIdInTourPackage={
            tourAssignmentIds:listAssignmentIdDelete,
            assignmentItemIds:assignmentItemIdsDelete
        }

        const data = {
            tourInstanceRequest: tourInstanceRequest,
            listIdInTourPackage: listIdInTourPackage
        }
        console.log("=======================values", data)
        try {
            const response = await ApiService.put("/tour-instance/update", data)
            if (response) {
                messageApi.open({
                    key: "send-request-update",
                    type: 'success',
                    content: 'Cập nhật thành công!',
                });
                setListAssignmentIdDelete([])
                setAssignmentItemIdsDelete([])
                setIsEdit(false)
                refreshData()
                // props.closeModal()
                props.refreshData()
            }
        } catch (error) {
            console.log("=============================", error)
            messageApi.open({
                key: "send-request-update",
                type: 'error',
                content: 'Cập nhật thất bại!',
            });
            // setErrorMessage(getErrorMessage(error.response.data.errorCode))
        }
    };

    const fetchListPackage = async () => {
        try {
            const data = await ApiService.get("/tour-package/get-all?sort=update_at,desc&size=1000")
            const listPackages = data?.content?.map((tourPackage) => {
                return {
                    value: tourPackage.id,
                    label: tourPackage.tourName,
                    day: tourPackage.day,
                }
            })
            setListTourPackage(listPackages)
        } catch (e) {
            console.log(e)
        }
    }
    const fetchListItems = async () => {
        try {
            const data = await ApiService.get("/item/get-all?size=1000")
            const listItem = data?.content?.map((item) => {
                return {
                    value: item.id,
                    label: item.name,
                }
            })
            setListItems(listItem)
        } catch (e) {
            console.log(e)
        }
    }

    const fetchListTourGuides = async () => {
        try {
            const data = await ApiService.get("/user/tour-guide/get")
            const listTourGuide = data?.map((tourGuide) => {
                return {
                    value: tourGuide.id,
                    label: `${tourGuide.lastName} ${tourGuide.firstName}`,
                }
            })
            setListTourGuides(listTourGuide)
        } catch (e) {
            console.log(e)
        }
    }

    const fetchListPassenger = async () => {
        try {
            const data = await ApiService.get("/passenger/get-all/no-tour")
            const passengers = data?.map((passenger) => {
                return {
                    value: passenger.id,
                    label: `${passenger.id} - ${passenger.lastName} ${passenger.firstName}`,
                }
            })
            setListPassenger(passengers)
        } catch (e) {
            console.log(e)
        }
    }

    const fetchListRiders = async () => {
        try {
            const data = await ApiService.get("/user/rider/get")
            const listRiders = data?.map((rider) => {
                return {
                    value: rider.id,
                    label: `${rider.lastName} ${rider.firstName} - ${rider.username}`,
                }
            })
            setListRiders(listRiders)
        } catch (e) {
            console.log(e)
        }
    }

    const confirmDeleteTourInstance = async () => {
        messageApi.open({
            key: "delete-tour-package",
            type: 'loading',
            content: 'Loading...',
        });
        const param = {
            tourPackageId: currentData.id
        }
        try {
            const response = await ApiService.delete("/tour-package/delete", param)
            if (response) {
                props.refreshData()
                props.closeModal()
                refreshData()
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

    const turnOffEditMode = () => {
        setIsEdit(false)
        form.setFieldsValue(currentData)
        setAssignmentItemIdsDelete([])
        setListAssignmentIdDelete([])
    }

    const turnOnEditMode = () => {
        setIsEdit(true)
    }

    const onFinishFailed = (errorInfo) => {
        // setErrorMessage("")
        // console.log('Failed:', errorInfo);
    };

    const refreshData = ()=>{
        fetchListTourGuides()
        fetchListPassenger()
        fetchListRiders()
    }

    useEffect(() => {
        fetchListPackage()
        fetchListTourGuides()
        fetchListRiders()
        fetchListPassenger()
        fetchListItems()
    }, []);

    useEffect(() => {
        if (props.tourInstanceId) {
            fetchTourInstance()
        }
    }, [props.tourInstanceId])


    return (
        <div className="overflow-y-scroll h-[500px] my-3">
            <Form
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                form={form}
                name="tour_package_form"
                className="px-2"
                layout="horizontal"
                onFinish={onFinishToUpdate}
                onFinishFailed={(errorInfo) => {
                    onFinishFailed(errorInfo)
                    message.error("Vui lòng kiểm tra lại các trường bị lỗi.");
                }}
            >
                <Form.Item
                    label="Tên chuyến đi"
                    name="tourInstanceName"
                    rules={[{required: true, message: "Tên chuyến đi không được để trống"}]}
                >
                    <Input readOnly={!isEdit}/>
                </Form.Item>
                <Form.Item
                    label="Gói tour"
                    name="tourPackage"
                    rules={[{required: true, message: "Gói tour không được để trống"}]}
                >
                    <Select
                        className={`${!isEdit ? 'readonly-select' : ''}`}
                        disabled={!isEdit}
                        labelInValue
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        showSearch
                        id="tourPackage"
                        defaultValue={null}
                        options={[...listTourPackage]}/>
                </Form.Item>
                <Form.Item
                    label="Thời gian"
                    name="time"
                    rules={[{required: true, message: "Thời gian không được để trống"}]}
                >
                    <RangePicker
                        // className="readonly-rangepicker"
                        inputReadOnly={true}
                        format="YYYY/MM/DD"
                        placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                    />
                </Form.Item>
                <Form.Item
                    label="Hướng dẫn viên"
                    name="tourGuide"
                >
                    <Select
                        className={`${!isEdit ? 'readonly-select' : ''}`}
                        disabled={!isEdit}
                        labelInValue
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        showSearch
                        id="tourGuide"
                        defaultValue={null}
                        options={[{label:"Chưa có",value:null},...listTourGuides]}/>
                </Form.Item>
                <div className="font-semibold text-neutral-800">Danh sách hành khách</div>
                <Form.List
                    name="tourAssignments"
                >
                    {(fields, {add, remove}, {errors}) => (
                        <>
                            {fields.map((field) => (
                                <Card
                                    className="my-2"
                                    key={field.key}
                                    size="small"
                                    title={`${field.name + 1}`}
                                    extra={isEdit ?
                                        <CloseOutlined onClick={() => {
                                            const currentTourAssignment = form.getFieldValue("tourAssignments");
                                            if (currentTourAssignment[field.name]?.id) {
                                                setListAssignmentIdDelete([...listAssignmentIdDelete, currentTourAssignment[field.name].id])
                                            }
                                            remove(field.name)
                                        }
                                        }/> : <div/>
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <div className="w-[48%]">
                                            <Form.Item
                                                {...field}
                                                rules={[{required: true, message: "Khách được để trống"}]}
                                                label="Khách"
                                                name={[field.name, "passenger"]}
                                            >
                                                <Select
                                                    className={`${!isEdit ? 'readonly-select' : ''}`}
                                                    disabled={!isEdit}
                                                    labelInValue
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    showSearch
                                                    id="passenger"
                                                    defaultValue={null}
                                                    options={listPassenger}/>
                                            </Form.Item>
                                            <Form.Item
                                                label="Lái xe"
                                                name={[field.name, "rider"]}
                                            >
                                                <Select
                                                    className={`${!isEdit ? 'readonly-select' : ''}`}
                                                    disabled={!isEdit}
                                                    labelInValue
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    showSearch
                                                    id="rider"
                                                    defaultValue={null}
                                                    options={[{value: null, label: "Tự lái"}, ...listRiders]}/>
                                            </Form.Item>
                                            <Form.Item
                                                label="Biển Số Xe"
                                                name={[field.name, "licensePlates"]}
                                                rules={[
                                                    // {
                                                    //     required: true,
                                                    //     message: 'Vui lòng nhập biển số xe!',
                                                    // },
                                                    {
                                                        pattern: vietnamLicensePlateRegex,
                                                        message: 'Biển số xe không hợp lệ!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    readOnly={!isEdit} placeholder="VD: 23AB-123.45"/>
                                            </Form.Item>
                                        </div>
                                        <div className="w-[50%]">
                                            <Form.List
                                                name={[field.name, "listItems"]}
                                            >
                                                {(itemFields, {add, remove}, {errors}) => (
                                                    <>
                                                        <div className="flex flex-row items-center gap-4 mb-6">
                                                            <div className="font-[500] text-neutral-700 inline">Danh
                                                                sách đồ dùng
                                                                (nếu có)
                                                                :
                                                            </div>
                                                            {isEdit ?
                                                                <Button onClick={() => add()} type="dashed">+ Thêm đồ
                                                                    dùng</Button> : ''}

                                                            {/*<Button className="inline w-[50px]" onClick={() => add()} block>*/}
                                                            {/*    + Thêm*/}
                                                            {/*</Button>*/}
                                                        </div>

                                                        {itemFields.map((itemField) => (
                                                            <div
                                                                key={itemField.key}
                                                                className="flex flex-row justify-evenly"
                                                            >
                                                                <Form.Item
                                                                    labelCol={{span: 8}}
                                                                    wrapperCol={{span: 24}}
                                                                    className="w-[250px]"
                                                                    {...itemField}
                                                                    rules={[{
                                                                        required: true,
                                                                        message: "Không được để trống"
                                                                    }]}
                                                                    label={`Đồ dùng ${itemField.name + 1}`}
                                                                    name={[itemField.name, "item"]}
                                                                >
                                                                    <Select
                                                                        className={`${!isEdit ? 'readonly-select' : ''}`}
                                                                        disabled={!isEdit}
                                                                        labelInValue
                                                                        filterOption={(input, option) =>
                                                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                        showSearch
                                                                        id="items"
                                                                        defaultValue={null}
                                                                        options={listItems}/>
                                                                </Form.Item>
                                                                <Form.Item

                                                                    labelCol={{span: 8}}
                                                                    wrapperCol={{span: 12}}
                                                                    label="Số lượng"
                                                                    name={[itemField.name, "quantity"]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: 'Vui lòng nhập',
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input readOnly={!isEdit} type="number"/>
                                                                </Form.Item>
                                                                <Form.Item>
                                                                    {isEdit ?
                                                                        <DeleteOutlined
                                                                            className="text-xl text-red-500  hover:text-red-400"
                                                                            onClick={() => {
                                                                                const currentAssignmentItem = form.getFieldValue("tourAssignments")[field.name]?.listItems;
                                                                                if (currentAssignmentItem[itemField.name]?.id) {
                                                                                    setAssignmentItemIdsDelete([...assignmentItemIdsDelete, currentAssignmentItem[itemField.name].id])
                                                                                }
                                                                                remove(itemField.name)
                                                                            }}
                                                                        /> : ''
                                                                    }
                                                                </Form.Item>
                                                            </div>
                                                            // <Card
                                                            //     className="my-2"
                                                            //     key={field.key}
                                                            //     size="small"
                                                            //     title={`${field.name + 1}`}
                                                            //     extra={
                                                            //
                                                            //     }
                                                            // >
                                                            //
                                                            // </Card>
                                                        ))}
                                                    </>
                                                )}
                                            </Form.List>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {isEdit ?
                                <Button type="dashed" onClick={() => add()} block>
                                    + Thêm hành khách
                                </Button> : ''}

                            <Form.ErrorList className="flex justify-center text-red-500" errors={errors}/>
                        </>
                    )}
                </Form.List>
                {/*<Form.Item noStyle shouldUpdate>*/}
                {/*    {() => (*/}
                {/*        <Typography>*/}
                {/*            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>*/}
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
                                    onConfirm={confirmDeleteTourInstance}
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
        </div>
    );
}

export default DetailTourInstanceForm;