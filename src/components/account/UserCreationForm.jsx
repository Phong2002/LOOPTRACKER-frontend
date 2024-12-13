import {Button, Col, Form, Input, message, Row, Select} from "antd";
import ImageUploadButton from "../common/ImageUploadButton.jsx";
import {useDispatch, useSelector} from 'react-redux';
import {
    addFileCCCDInputFront,
    addFileCCCDInputBack,
    addFileGPLXInputFront,
    addFileGPLXInputBack,
    updateData,
    updateStep
} from "../../redux/fearture/RegistrationRequestSlice.jsx"
import {useEffect, useState} from "react";
import GhnApiService from "../../service/GhnApiService.jsx";
import apiService from "../../service/ApiService.jsx";
import {getErrorMessage} from "../../utils/MessageError.jsx";


function UserCreationForm(props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [messageError, setMessageError] = useState("")
    const [listProvince, setListProvince] = useState([])
    const [listDistrict, setListDistrict] = useState([])
    const [listWard, setListWard] = useState([])
    const [province, setProvince] = useState()
    const [district, setDistrict] = useState()
    const [ward, setWard] = useState()
    const dispatch = useDispatch();
    const data = useSelector(state => state.registrationRequest);

    const onFinish = async (values) => {
        setMessageError("")
        let user = {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            gender: values.gender,
            email: values.email,
            role: values.role
        }

        let riderInfor = {

        }

        if(props.isModalHaveRiderInfor){
            riderInfor={
                licenseNumber:values.licenseNumber,
                citizenIdNumber:values.citizenIdNumber,
                address:`${values.ward.label} - ${values.district.label} - ${values.province.label}`
            }
        }

        let dataSend={
            user:user,
            riderInfor:riderInfor
        }

        messageApi.open({
            key: "send-request",
            type: 'loading',
            content: 'Loading...',
            duration: 20000
        });
        const dataForm = new FormData();
        dataForm.append('registrationRequestJson', JSON.stringify(dataSend));
        dataForm.append("fileCCCDInputFront", data.fileCCCDInputFront)
        dataForm.append("fileCCCDInputBack", data.fileCCCDInputBack)
        dataForm.append("fileGPLXInputFront", data.fileGPLXInputFront)
        dataForm.append("fileGPLXInputBack", data.fileGPLXInputBack)
        try {
            const response = await apiService.postFormData("/user/create-account", dataForm)
            messageApi.open({
                key: "send-request",
                type: 'success',
                content: 'Gửi yêu cầu thành công',
            });
            dispatch(updateStep(1));
        } catch (error) {
            console.log("================ERROR", error)
            messageApi.open({
                key: "send-request",
                type: 'error',
                content: 'Gửi yêu cầu thất bại',
            });
            setMessageError(getErrorMessage(error.response?.data.errorCode))
        }


    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onChangeProvince = (selected) => {
        setProvince(selected)

    }

    const onChangeDistrict = (selected) => {
        setDistrict(selected)
    }

    const onChangeWard = (selected) => {
        console.log("===============")
        setWard(selected)
        console.log(selected)
    }
    const fetchListProvince = async () => {
        const response = await GhnApiService.get("/province")
        setListProvince(response.data)
    }

    const fetchListDistrict = async () => {
        const response = await GhnApiService.get("/district", {province_id: province.value})
        setListDistrict(response.data)
    }

    const fetchListWard = async () => {
        const response = await GhnApiService.get("/ward", {district_id: district.value})
        setListWard(response.data)
    }

    useEffect(() => {
        fetchListProvince()
    }, []);

    useEffect(() => {
        if (province) {
            fetchListDistrict();
            props.form.setFieldsValue({district: null});
            props.form.setFieldsValue({ward: null});
        }
    }, [province]);

    useEffect(() => {
        if (district) {
            fetchListWard();
            props.form.setFieldsValue({ward: null});
        }
    }, [district]);


    return (
        <div className=" w-full">
            <Form
                form={props.form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={data}
                onValuesChange={props.handleValuesChange}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 20,
                }}
                layout="horizontal"
            >
                <div
                    className="flex flex-row w-full items-start justify-around"
                >
                    <div className={`${props.isModalHaveRiderInfor ? 'w-[50%]' : 'w-full'} h-full`}>
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
                        <Form.Item label="Vai trò"
                                   name="role"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Vai trò không được để trống"
                                       },
                                   ]}>
                            <Select
                                options={[
                                    {value: 'EASY_RIDER', label: 'Tài xế'},
                                    {value: 'TOUR_GUIDE', label: 'Hướng dẫn viên'},
                                    {value: 'MANAGER', label: 'Quản lý'},
                                    {value: 'ADMIN', label: 'Admin'},
                                ]}
                            />
                        </Form.Item>
                        {props.isModalHaveRiderInfor ?
                            <Form.Item label="Địa chỉ">
                                <Row gutter={1}>
                                    <Col span={8}>
                                        <Form.Item
                                            name="province"
                                            rules={[{required: true, message: "Không được để trống"}]}
                                        >
                                            <Select
                                                placeholder="Chọn Tỉnh"
                                                labelInValue
                                                onChange={onChangeProvince}
                                                filterOption={(input, option) =>
                                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                                }
                                                showSearch
                                                options={listProvince.map((province) => ({
                                                    value: province.ProvinceID,
                                                    label: province.ProvinceName,
                                                }))}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            name="district"
                                            rules={[{required: true, message: "Không được để trống"}]}
                                        >
                                            <Select
                                                placeholder="Chọn Huyện"
                                                labelInValue
                                                value={district}
                                                onChange={onChangeDistrict}
                                                filterOption={(input, option) =>
                                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                                }
                                                showSearch
                                                options={listDistrict.map((district) => ({
                                                    value: district.DistrictID,
                                                    label: district.DistrictName,
                                                }))}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            name="ward"
                                            rules={[{required: true, message: "Không được để trống"}]}
                                        >
                                            <Select
                                                placeholder="Chọn Xã"
                                                labelInValue
                                                value={ward}
                                                onChange={onChangeWard}
                                                filterOption={(input, option) =>
                                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                                }
                                                showSearch
                                                options={listWard.map((ward) => ({
                                                    value: ward.WardCode,
                                                    label: ward.WardName,
                                                }))}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item> : ''}

                    </div>
                    {props.isModalHaveRiderInfor ?
                        <div className="w-[45%] h-full  ">
                            <Form.Item label="Số căn CCCD"
                                       name="citizenIdNumber"
                                       rules={[
                                           {
                                               required: true,
                                               message: "Số căn cước công dân không được để trống"
                                           },
                                       ]}>
                                <Input/>
                            </Form.Item>
                            <div className="flex flex-row justify-around mb-[50px]">
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
                                       name="licenseNumber"
                                       rules={[
                                           {
                                               required: true,
                                               message: "Số giấy phép lái xe không được để trống"
                                           },
                                       ]}>
                                <Input/>
                            </Form.Item>

                            <div className="flex flex-row justify-around">
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
                        </div> : ''}
                </div>
                <div className="flex justify-center items-center h-[25px] text-red-500 ">
                    <i>
                        {messageError}
                    </i>
                </div>
                <Button htmlType="submit">Tạo tài khoản</Button>
            </Form>
            {contextHolder}
        </div>
    )
}

export default UserCreationForm;