import {Button, ConfigProvider, Image, message, Popconfirm} from "antd";
import {useEffect, useState} from "react";
import ApiService from "../../service/ApiService.jsx";

function DetailRiderInfor(props) {
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const host = import.meta.env.VITE_SERVER_HOST;
    const prefix = import.meta.env.VITE_SERVER_PREFIX;
    const baseURL = `${apiUrl}:${host}/${prefix}/file/image/download`
    const [riderInfor, setRiderInfor] = useState();
    const [confirmUnLockLoading, setConfirmUnLockLoading] = useState(false)
    const [confirmLockLoading, setConfirmLockLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const handleLockAndUnLock = async (type) => {
        messageApi.open({
            key: "confirm-lock",
            type: 'loading',
            content: 'Loading...',
        });
        try {
            const dataForm = new FormData();
            dataForm.append('id', props.rider.id);

            const response = await ApiService.putFormData("/user/" + type, dataForm)
            if (response) {
                props.refreshData()
                props.changeIsLockUser()
                messageApi.open({
                    key: "confirm-lock",
                    type: 'success',
                    content: `${type == 'lock' ? 'Khóa' : 'Mở khóa'} tài khoản thành công!`,
                });
            }
        } catch (error) {
            console.log("=============================", error)
            messageApi.open({
                key: "confirm-lock",
                type: 'error',
                content: `${type == 'lock' ? 'Khóa' : 'Mở khóa'} tài khoản thất bại!`,
            });
        }
    }

    const confirmLock = async () => {
        setConfirmLockLoading(true)
        await handleLockAndUnLock("lock")
        setConfirmLockLoading(false)
    };

    const confirmUnLock = async () => {
        setConfirmUnLockLoading(true)
        await handleLockAndUnLock("unlock")
        setConfirmUnLockLoading(false)
    };


    useEffect(() => {
        async function fetchRiderInfor() {
            try {
                const param = {riderId: props.rider.id};
                const data = await ApiService.get("/rider-infor/get", param);
                setRiderInfor(data);
            } catch (e) {
                console.error(e);
            }
        }
        fetchRiderInfor();
    }, [props.rider]);

    return (
        <div className=" h-full flex bg-white  px-8 w-full rounded-[10px] ">
            {contextHolder}
            <div>
                <div className="flex flex-row gap-4">
                    <div
                        className="w-[48%] p-6 bg-white shadow-lg rounded-lg flex flex-col gap-6 border border-green-500">
                        {/* Header Section */}
                        <div
                            className="text-center text-[20px] font-bold text-green-600 uppercase tracking-wide border-b-2 border-green-500 pb-2">
                            Thông Tin Lái Xe
                        </div>

                        {/* Rider Info Rows */}
                        <div className="flex items-center py-2 border-b border-gray-300">
                            <span className="w-[140px] font-semibold text-gray-700">Họ và tên:</span>
                            <div
                                className="flex-1 text-green-700 font-medium">{`${props.rider.lastName} ${props.rider.firstName}`}</div>
                        </div>

                        <div className="flex items-center py-2 border-b border-gray-300">
                            <span className="w-[140px] font-semibold text-gray-700">Số điện thoại:</span>
                            <div className="flex-1 text-green-700 font-medium">{props.rider.phoneNumber}</div>
                        </div>

                        <div className="flex items-center py-2 border-b border-gray-300">
                            <span className="w-[140px] font-semibold text-gray-700">Email:</span>
                            <div className="flex-1 text-green-700 font-medium">{props.rider.email}</div>
                        </div>

                        <div className="flex items-center py-2 border-b border-gray-300">
                            <span className="w-[140px] font-semibold text-gray-700">Số CCCD:</span>
                            <div className="flex-1 text-green-700 font-medium">{riderInfor?.citizenIdNumber}</div>
                        </div>

                        <div className="flex items-center py-2 border-b border-gray-300">
                            <span className="w-[140px] font-semibold text-gray-700">Số GPLX:</span>
                            <div className="flex-1 text-green-700 font-medium">{riderInfor?.licenseNumber}</div>
                        </div>

                        <div className="flex items-center py-2 border-b border-gray-300">
                            <span className="w-[140px] font-semibold text-gray-700">Địa chỉ:</span>
                            <div className="flex-1 text-green-700 font-medium">{riderInfor?.address}</div>
                        </div>
                        {/*/!* Footer Section *!/*/}
                        {/*<div className="flex justify-center items-center mt-6">*/}
                        {/*    <button*/}
                        {/*        className="px-6 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all">*/}
                        {/*        Chỉnh sửa thông tin*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>

                    <div className="flex flex-col w-[80%] ">
                        <div className="flex flex-row gap-4  shadow-md bg-gray-50 rounded-[5px] p-2">
                            <div className="bg-black/5 rounded-[5px] p-4 border-t-[3px] border-green-500 ">
                                <span className="font-semibold">Ảnh mặt trước CCCD:</span>
                                <Image width={285} height={180}
                                       className="w-[285px]  object-contain h-[180px] rounded-[5px]"
                                       src={`${baseURL}/${riderInfor?.cccdFront}`}/>
                            </div>
                            <div className="bg-black/5 rounded-[5px] border-t-[3px] border-green-500 p-4">
                                <span className="font-semibold">Ảnh mặt sau CCCD:</span>
                                <Image width={285} height={180}
                                       className="w-[285px]  object-contain h-[180px]  rounded-[5px]"
                                       src={`${baseURL}/${riderInfor?.cccdBack}`}/>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 bg-gray-50 shadow-md rounded-[5px] p-2">
                            <div className="bg-black/5 rounded-[5px] border-t-[3px] border-green-500 p-4">
                                <span className="font-semibold">Ảnh mặt trước GPLX:</span>
                                <Image width={285} height={180}
                                       className="w-[285px]  object-contain  h-[180px] rounded-[5px]"
                                       src={`${baseURL}/${riderInfor?.gplxFront}`}/>
                            </div>
                            <div className="bg-black/5 rounded-[5px] border-t-[3px] border-green-500 p-4">
                                <span className="font-semibold">Ảnh mặt sau GPLX:</span>
                                <Image width={285} height={180}
                                       className="w-[285px] object-contain  h-[180px] rounded-[5px]"
                                       src={`${baseURL}/${riderInfor?.gplxBack}`}/>
                            </div>
                        </div>
                    </div>
                </div>
                {props.rider.isAccountNonLocked ?
                    <div className="flex justify-center items-center m-4">
                        <ConfigProvider theme={{
                            token: {
                                colorPrimary: '#ff0000',
                            }
                        }}>
                            <Popconfirm
                                title="Khóa tài khoản"
                                description={`Bạn có chắc muốn khóa tài khoản của ${props.rider.lastName} ${props.rider.firstName}`}
                                onConfirm={confirmLock}
                                okButtonProps={{loading: confirmLockLoading}}
                                okText="Khóa"
                                cancelText="Hủy"
                            >
                                <Button type="primary" ghost>Khóa Tài Khoản</Button>
                            </Popconfirm>

                        </ConfigProvider>
                    </div>
                    :
                    <div className="flex justify-center items-center m-4">
                        <ConfigProvider theme={{
                            token: {
                                colorPrimary: '#00bb1c',
                            }
                        }}>
                            <Popconfirm
                                title="Mở khóa tài khoản"
                                description={`Bạn có chắc muốn mở khóa khóa tài khoản của ${props.rider.lastName} ${props.rider.firstName}`}
                                onConfirm={confirmUnLock}
                                okButtonProps={{loading: confirmUnLockLoading}}
                                okText="Mở khóa"
                                cancelText="Hủy"
                            >
                                <Button type="primary" ghost>Mở Khóa Tài Khoản</Button>
                            </Popconfirm>
                        </ConfigProvider>
                    </div>
                }
            </div>
        </div>
    )
}

export default DetailRiderInfor;