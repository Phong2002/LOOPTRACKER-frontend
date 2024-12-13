import {Button, Form, Input, message, Select} from "antd";
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

function RegisterRequestForm() {
    const [messageApi, contextHolder] = message.useMessage();
    const [messageError,setMessageError] = useState("")
    const [form] = Form.useForm();
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
        dispatch(updateData(values))
        let dataSend = values;
        dataSend.address = `${values.ward.label} - ${values.district.label} - ${values.province.label}`
        messageApi.open({
            key:"send-request",
            type: 'loading',
            content: 'Loading...',
            duration:20000
        });
        const dataForm = new FormData();
        dataForm.append('registrationRequestJson', JSON.stringify(dataSend));
        dataForm.append("fileCCCDInputFront",data.fileCCCDInputFront)
        dataForm.append("fileCCCDInputBack",data.fileCCCDInputBack)
        dataForm.append("fileGPLXInputFront",data.fileGPLXInputFront)
        dataForm.append("fileGPLXInputBack",data.fileGPLXInputBack)
        try{
            const response = await apiService.postFormData("/registration-request/easy-rider",dataForm)
            messageApi.open({
                key:"send-request",
                type: 'success',
                content: 'Gửi yêu cầu thành công',
            });
            dispatch(updateStep(1));
        }
        catch (error){
            console.log("================ERROR",error)
            messageApi.open({
                key:"send-request",
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
            form.setFieldsValue({district: null});
            form.setFieldsValue({ward: null});
        }
    }, [province]);

    useEffect(() => {
        if (district) {
            fetchListWard();
            form.setFieldsValue({ward: null});
        }
    }, [district]);


    return (
        <div className=" w-full">
            <Form
                form={form}
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
                    className="flex flex-row w-full items-start justify-around"
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

                        <Form.Item label="Tỉnh"
                                   name="province"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Tỉnh không được để trống"
                                       },
                                   ]}>
                            <Select
                                labelInValue
                                value={null}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                showSearch
                                onChange={onChangeProvince}
                                options={listProvince.map((province) => {
                                    return {value: province.ProvinceID, label: province.ProvinceName}
                                })}
                            />

                        </Form.Item>
                        <Form.Item label="Huyện"
                                   name="district"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Huyện không được để trống"
                                       },
                                   ]}>
                            <Select
                                labelInValue
                                value={district}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                showSearch
                                onChange={onChangeDistrict}
                                options={listDistrict.map((district) => {
                                    return {value: district.DistrictID, label: district.DistrictName}
                                })}
                            >
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
                            <Select
                                labelInValue
                                value={ward}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                showSearch
                                onChange={onChangeWard}
                                options={listWard.map((ward) => {
                                    return {value: ward.WardCode, label: ward.WardName}
                                })}
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

                    </div>
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
                    </div>
                </div>
                    <div className="flex justify-center items-center h-[25px] text-red-500 ">
                        <i>
                            {messageError}
                        </i>
                    </div>
                <Button htmlType="submit">Gửi yêu cầu đăng ký</Button>
            </Form>
            {contextHolder}
        </div>
    )
}

export default RegisterRequestForm;