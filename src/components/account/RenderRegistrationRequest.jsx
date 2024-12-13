import {Button, Card, ConfigProvider, Image, message, Modal, Popconfirm} from "antd";
import {useState} from "react";
import {QuestionCircleOutlined, SelectOutlined} from "@ant-design/icons";
import ApiService from "../../service/ApiService.jsx";
import apiService from "../../service/ApiService.jsx";

function RenderRegistrationRequest(props) {
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const host = import.meta.env.VITE_SERVER_HOST;
    const prefix = import.meta.env.VITE_SERVER_PREFIX;
    const baseURL = `${apiUrl}:${host}/${prefix}/file/image/download`
    const [messageApi, contextHolder] = message.useMessage();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const confirmRequest = async () => {
        messageApi.open({
            key: "confirm-request",
            type: 'loading',
            content: 'Loading...',
        });
        const dataForm = new FormData();
        dataForm.append('requestId', props.request.id);
        try {
            const response = await apiService.postFormData("/registration-request/confirm", dataForm)
            if (response) {
                props.refreshData()
                messageApi.open({
                    key: "confirm-request",
                    type: 'success',
                    content: 'Duyệt thành công!',
                });
            }
        } catch (error) {
            messageApi.open({
                key: "confirm-request",
                type: 'error',
                content: 'Duyệt thất bại!',
            });
        }
    }

    const rejectRequest = async () => {
        messageApi.open({
            key: "reject-request",
            type: 'loading',
            content: 'Loading...',
        });
        const dataForm = new FormData();
        dataForm.append('requestId', props.request.id);
        try {
            const response = await apiService.putFormData("/registration-request/reject", dataForm)
            if (response) {
                props.refreshData()
                messageApi.open({
                    key: "reject-request",
                    type: 'success',
                    content: 'Từ chối thành công!',
                });
            }
        } catch (error) {
            messageApi.open({
                key: "reject-request",
                type: 'error',
                content: 'Từ chối thất bại!',
            });
        }
    }

    const deleteRequest = async () => {
        const param = {
            id: props.request.id,
        }
        messageApi.open({
            key: "delete-request",
            type: 'loading',
            content: 'Loading...',
        });
        try {
            const response = await apiService.delete("/registration-request/delete", param)
            if (response) {
                props.refreshData()
                messageApi.open({
                    key: "delete-request",
                    type: 'success',
                    content: 'Xóa thành công!',
                });
            }
        } catch (error) {
            messageApi.open({
                key: "delete-request",
                type: 'error',
                content: 'Xóa thất bại!',
            });
        }
    }
    const renderStatus = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="text-neutral-600 font-semibold">Đang chờ duyệt</span>
            case 'APPROVED':
                return <span className="text-green-500 font-semibold">Đã duyệt</span>
            case 'REJECTED':
                return <span className="text-red-500 font-semibold">Đã từ chối</span>
        }
    }

    return (
        <div className="m-2 h-[140px] flex bg-white p-4 px-8 w-full rounded-[10px] shadow-md active:bg-neutral-100 ">
            {contextHolder}
            <div className="flex flex-row w-[800px] justify-between ">
                <div className="flex flex-col items-start justify-between cursor-pointer  w-full"
                     onClick={showModal}
                >
                    <div>
                        <span className="w-[140px] font-semibold text-gray-700">Họ và tên: </span>
                        <div className="inline">{`${props.request.lastName} ${props.request.firstName}`}</div>
                    </div>
                    <div>
                        <span className="w-[140px] font-semibold text-gray-700">Số CCCD: </span>
                        <div className="inline">{`${props.request.citizenIdNumber}`}</div>
                    </div>
                    <div>
                        <span className="w-[140px] font-semibold text-gray-700">Số GPLX: </span>
                        <div className="inline">{`${props.request.licenseNumber}`}</div>
                    </div>
                    <div>
                        <span className="w-[140px] font-semibold text-gray-700">Địa chỉ: </span>
                        <div className="inline">{`${props.request.address}`}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 justify-center items-end w-[350px]">
                    <div>
                        <span className="font-semibold text-neutral-600 px-2">Trạng thái :</span>
                        <span>{renderStatus(props.request.status)}</span>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        {(props.request.status == 'PENDING' || props.request.status == 'REJECTED') ?
                            <div>
                                <ConfigProvider theme={{token: {colorPrimary: '#00c259'},}}>
                                    <Popconfirm
                                        title="Duyệt yêu cầu"
                                        description={`Bạn có chắc chắn muốn duyệt yêu cầu này ?`}
                                        icon={<SelectOutlined style={{color: 'green'}}/>}
                                        // open={open}
                                        // onOpenChange={handleOpenChange}
                                        onConfirm={confirmRequest}
                                        // onCancel={cancel}
                                        okText="Duyệt"
                                        cancelText="Không"
                                    >
                                        <Button type="primary" ghost>
                                            Duyệt
                                        </Button>
                                    </Popconfirm>
                                </ConfigProvider>
                            </div>
                            :
                            ''
                        }
                        {props.request.status == 'PENDING' ?
                            <div>
                                <ConfigProvider theme={{token: {colorPrimary: '#ff0000'},}}>
                                    <Popconfirm
                                        title="Từ chối yêu cầu"
                                        description={`Bạn có chắc chắn muốn từ chối yêu cầu này ?`}
                                        icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                        // open={open}
                                        // onOpenChange={handleOpenChange}
                                        onConfirm={rejectRequest}
                                        // onCancel={cancel}
                                        okText="Từ chối"
                                        cancelText="Không"
                                    >
                                        <Button type="primary" ghost>
                                            Từ chối
                                        </Button>
                                    </Popconfirm>
                                </ConfigProvider>
                            </div>
                            :
                            ''
                        }

                        <div>
                            <ConfigProvider theme={{token: {colorPrimary: '#888888'},}}>
                                <Popconfirm
                                    title="Xóa yêu cầu"
                                    description={`Bạn có chắc chắn muốn xóa yêu cầu này ?`}
                                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                    // open={open}
                                    // onOpenChange={handleOpenChange}
                                    onConfirm={deleteRequest}
                                    // onCancel={cancel}
                                    okText="Xóa"
                                    cancelText="Không"
                                >
                                    <Button type="primary" ghost>
                                        Xóa
                                    </Button>
                                </Popconfirm>
                            </ConfigProvider>

                        </div>
                    </div>
                </div>
            </div>
            <Modal title="Chi tiết yêu cầu" width={1200} open={isModalOpen} footer={null} onCancel={handleCancel}>
                <div>
                    <div className="flex flex-row gap-4">
                        <div className="w-[48%] flex flex-col gap-4 text-[16px] border-green-500 p-4 rounded-[10px] border-[1px]">
                            <div className="flex items-center py-2 border-b border-gray-300">
                                <span className="w-[140px] font-semibold text-gray-700">Họ và tên: </span>
                                <div className="inline">{`${props.request.lastName} ${props.request.firstName}`}</div>
                            </div>
                            <div className="flex items-center py-2 border-b border-gray-300">
                                <span className="w-[140px] font-semibold text-gray-700">Số điện thoại: </span>
                                <div className="inline">{`${props.request.phoneNumber}`}</div>
                            </div>
                            <div className="flex items-center py-2 border-b border-gray-300">
                                <span className="w-[140px] font-semibold text-gray-700">Email: </span>
                                <div className="inline">{`${props.request.email}`}</div>
                            </div>
                            <div className="flex items-center py-2 border-b border-gray-300">
                                <span className="w-[140px] font-semibold text-gray-700">Số CCCD: </span>
                                <div className="inline">{`${props.request.citizenIdNumber}`}</div>
                            </div>
                            <div className="flex items-center py-2 border-b border-gray-300">
                                <span className="w-[140px] font-semibold text-gray-700">Số GPLX: </span>
                                <div className="inline">{`${props.request.licenseNumber}`}</div>
                            </div>
                            <div className="flex items-center py-2 border-b border-gray-300">
                                <span className="w-[140px] font-semibold text-gray-700">Địa chỉ: </span>
                                <div className="inline">{`${props.request.address}`}</div>
                            </div>


                            <div className="flex h-full justify-center items-end">
                                <div className="flex flex-row gap-4 items-center">
                                    {(props.request.status == 'PENDING' || props.request.status == 'REJECTED') ?
                                        <div>
                                            <ConfigProvider theme={{token: {colorPrimary: '#00c259'},}}>
                                                <Popconfirm
                                                    title="Duyệt yêu cầu"
                                                    description={`Bạn có chắc chắn muốn duyệt yêu cầu này ?`}
                                                    icon={<SelectOutlined style={{color: 'green'}}/>}
                                                    // open={open}
                                                    // onOpenChange={handleOpenChange}
                                                    onConfirm={confirmRequest}
                                                    // onCancel={cancel}
                                                    okText="Duyệt"
                                                    cancelText="Không"
                                                >
                                                    <Button type="primary" ghost>
                                                        Duyệt
                                                    </Button>
                                                </Popconfirm>
                                            </ConfigProvider>
                                        </div>
                                        :
                                        ''
                                    }
                                    {props.request.status == 'PENDING' ?
                                        <div>
                                            <ConfigProvider theme={{token: {colorPrimary: '#ff0000'},}}>
                                                <Popconfirm
                                                    title="Từ chối yêu cầu"
                                                    description={`Bạn có chắc chắn muốn từ chối yêu cầu này ?`}
                                                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                                    // open={open}
                                                    // onOpenChange={handleOpenChange}
                                                    onConfirm={rejectRequest}
                                                    // onCancel={cancel}
                                                    okText="Từ chối"
                                                    cancelText="Không"
                                                >
                                                    <Button type="primary" ghost>
                                                        Từ chối
                                                    </Button>
                                                </Popconfirm>
                                            </ConfigProvider>
                                        </div>
                                        :
                                        ''
                                    }

                                    <div>
                                        <ConfigProvider theme={{token: {colorPrimary: '#888888'},}}>
                                            <Popconfirm
                                                title="Xóa yêu cầu"
                                                description={`Bạn có chắc chắn muốn xóa yêu cầu này ?`}
                                                icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                                // open={open}
                                                // onOpenChange={handleOpenChange}
                                                onConfirm={deleteRequest}
                                                // onCancel={cancel}
                                                okText="Xóa"
                                                cancelText="Không"
                                            >
                                                <Button type="primary" ghost>
                                                    Xóa
                                                </Button>
                                            </Popconfirm>
                                        </ConfigProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-[80%] gap-4">
                            <div className="flex flex-row gap-4 shadow-md bg-gray-50 rounded-[5px] p-2">
                                <div className="bg-black/5 rounded-[5px] p-4 border-t-green-500 border-[2px]">
                                    <span className="font-semibold">Ảnh mặt trước CCCD:</span>
                                    <Image width={285} height={180}
                                           className="w-[285px]  object-contain h-[180px] rounded-[5px]"
                                           src={`${baseURL}/${props.request.cccdFront}`}/>
                                </div>
                                <div className="bg-black/5 rounded-[5px] border-t-green-500  border-[2px]  p-4">
                                    <span className="font-semibold">Ảnh mặt sau CCCD:</span>
                                    <Image width={285} height={180}
                                           className="w-[285px]  object-contain h-[180px] rounded-[5px]"
                                           src={`${baseURL}/${props.request.cccdBack}`}/>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 bg-gray-50 shadow-md  rounded-[5px] p-2">
                                <div className="bg-black/5 rounded-[5px] p-4 border-t-green-500 border-[2px]">
                                    <span className="font-semibold">Ảnh mặt trước GPLX:</span>
                                    <Image width={285} height={180}
                                           className="w-[285px]  object-contain  h-[180px] rounded-[5px]"
                                           src={`${baseURL}/${props.request.gplxFront}`}/>
                                </div>
                                <div className="bg-black/5 rounded-[5px] p-4 border-t-green-500 border-[2px]">
                                    <span className="font-semibold">Ảnh mặt sau GPLX:</span>
                                    <Image width={285} height={180}
                                           className="w-[285px] object-contain  h-[180px] rounded-[5px]"
                                           src={`${baseURL}/${props.request.gplxBack}`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default RenderRegistrationRequest;