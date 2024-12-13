import {Button, Card, DatePicker, Form, Input, message, Select, Typography} from "antd";
import {useEffect, useState} from "react";
import ApiService from "../../service/ApiService.jsx";

const {RangePicker} = DatePicker;
import dayjs from 'dayjs';

import Icon, {CloseOutlined, DeleteFilled, DeleteOutlined} from "@ant-design/icons";

function CreateTourInstanceForm(props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [errorMessage, setErrorMessage] = useState("");
    const [dates, setDates] = useState([dayjs().format("YYYY/MM/DD"), dayjs().format("YYYY/MM/DD")]);
    const [listTourPackage, setListTourPackage] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [listPassenger, setListPassenger] = useState([]);
    const [listTourGuides, setListTourGuides] = useState([]);
    const [listRiders, setListRiders] = useState([]);
    const vietnamLicensePlateRegex = /^\d{2}[A-Z,a-z]{1,2}\d?\s?-?\s?\d{3,5}(\.\d{2})?$/;

    const onFinish = async (values) => {
        setErrorMessage("")
        messageApi.open({
            key: "send-request",
            type: 'loading',
            content: 'Loading...',
        });
        let data = {
            tourPackage:values.tourPackage.value,
            name:values.tourInstanceName,
            tourGuide:values.tourGuide.value,
            startDate:values.time[0].format('YYYY-MM-DD'),
            endDate:values.time[1].format('YYYY-MM-DD'),
            tourAssignments:values.tourAssignments?.map((tourAssignment)=>{
                return {
                    passenger:tourAssignment.passenger.value,
                    rider:tourAssignment.rider.value,
                    licensePlates:tourAssignment.licensePlates,
                    listItems:tourAssignment.listItems?.map((item)=>{
                        return {
                            itemId:item.item.value,
                            quantity:item.quantity,
                        }
                    })??[]
                }
            })??[]
        }

        try {
            const response = await ApiService.post("/tour-instance/create", data)
            if (response) {
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

    const onFinishFailed = (errorInfo) => {
        // setErrorMessage("")
        // console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        fetchListPackage()
        fetchListTourGuides()
        fetchListRiders()
        fetchListPassenger()
        fetchListItems()
    }, []);

    return (
        <div className="overflow-y-scroll h-[500px]">
            <Form
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                form={props.form}
                name="tour_package_form"
                className="px-2"
                layout="horizontal"
                onFinish={onFinish}
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
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Gói tour"
                    name="tourPackage"
                    rules={[{required: true, message: "Gói tour không được để trống"}]}
                >
                    <Select
                        labelInValue
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        showSearch
                        id="tourPackage"
                        defaultValue={null}
                        options={[ ...listTourPackage]}/>
                </Form.Item>
                <Form.Item
                    label="Thời gian"
                    name="time"
                    rules={[{required: true, message: "Thời gian không được để trống"}]}
                >
                    <RangePicker
                        format="YYYY/MM/DD"
                        placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                    />
                </Form.Item>
                <Form.Item
                    label="Hướng dẫn viên"
                    name="tourGuide"
                >
                    <Select
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
                                    extra={
                                        <CloseOutlined onClick={() => remove(field.name)}/>
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
                                            labelInValue
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            showSearch
                                            id="rider"
                                            defaultValue={null}
                                            options={listRiders}/>
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
                                        <Input placeholder="VD: 23AB-123.45"/>
                                    </Form.Item>
                                        </div>
                                        <div className="w-[50%]">
                                            <Form.List
                                                name={[field.name, "listItems"]}
                                            >
                                                {(fields, {add, remove}, {errors}) => (
                                                    <>
                                                        <div className="flex flex-row items-center gap-4 mb-6">
                                                        <div className="font-[500] text-neutral-700 inline">Danh sách đồ dùng
                                                            (nếu có)
                                                            :
                                                        </div>
                                                            <Button onClick={() => add()} type="dashed">+ Thêm đồ dùng</Button>
                                                        {/*<Button className="inline w-[50px]" onClick={() => add()} block>*/}
                                                        {/*    + Thêm*/}
                                                        {/*</Button>*/}
                                                        </div>

                                                        {fields.map((field) => (
                                                            <div
                                                                key={field.key}
                                                                className="flex flex-row justify-evenly"
                                                            >
                                                                <Form.Item
                                                                    labelCol={{span: 8}}
                                                                    wrapperCol={{span: 24}}
                                                                    className="w-[250px]"
                                                                    {...field}
                                                                    rules={[{
                                                                        required: true,
                                                                        message: "Không được để trống"
                                                                    }]}
                                                                    label={`Đồ dùng ${field.name + 1}`}
                                                                    name={[field.name, "item"]}
                                                                >
                                                                    <Select
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
                                                                    label= "Số lượng"
                                                                    name={[field.name, "quantity"]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: 'Vui lòng nhập',
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input type="number"/>
                                                                </Form.Item>
                                                                <Form.Item>
                                                                    <DeleteOutlined className="text-xl text-red-500  hover:text-red-400" onClick={() => remove(field.name)} />
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
                            <Button type="dashed" onClick={() => add()} block>
                                + Thêm hành khách
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

export default CreateTourInstanceForm;