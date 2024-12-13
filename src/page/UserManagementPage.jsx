import {useEffect, useState} from "react";
import ApiService from "../service/ApiService.jsx";
import {Button, ConfigProvider, Form, Modal, Pagination, Select, Table} from "antd";
import {DeleteOutlined, InfoCircleOutlined, SearchOutlined} from "@ant-design/icons";
import PassengerCreationForm from "../components/passenger/PassengerCreationForm.jsx";
import DetailRiderInfor from "../components/account/DetailRiderInfor.jsx";
import UserCreationForm from "../components/account/UserCreationForm.jsx";


const renderRole = {
    EASY_RIDER:"Tài Xế",
    TOUR_GUIDE:"Hướng dẫn viên",
    MANAGER:"Quản lý",
    ADMIN:"ADMIN"
}

function UserManagementPage() {
    const [listPassengers, setListPassengers] = useState([]);
    const [isModalCreatePassengerOpen, setIsModalCreatePassengerOpen] = useState(false);
    const [isModalHaveRiderInfor,setIsModalHaveRiderInfor] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalItem, setTotalItem] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [form] = Form.useForm();
    const [isOpenDetailModal, setIsOpenDetailModal] = useState(false)
    const [currentDetaRider, setCurrentDetaRider] = useState()
    const [search, setSearch] = useState('')

    const fetchListPassengers = async () => {

        const param = {
            sort:"create_at,desc",
            size: pageSize,
            page: pageNumber - 1,
            search: search.replace(/\s+/g, ' ').trim(),
        }

        const data = await ApiService.get("/user/private/get-all", param)
        setListPassengers(data.content)
        setTotalItem(data.totalElements)
    }

    const handleClickDetailRider = (record) => {
        setCurrentDetaRider(record)
        setIsOpenDetailModal(true)
    }

    const handleSearch = () => {
        // if(search.replace(/\s+/g, ' ').trim()){
        setPageNumber(0)
        fetchListPassengers()
        // }

    }

    const changeIsLockUser = ()=>{
        let newInfor = currentDetaRider
        newInfor.isAccountNonLocked = !currentDetaRider.isAccountNonLocked
        setCurrentDetaRider(newInfor)
    }

    const showModal = () => {
        setIsModalCreatePassengerOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalCreatePassengerOpen(false);
    };

    const onChangePageNumber = (page) => {
        setPageNumber(page)
        console.log("=================", page)
    }




    const columns = [
        {
            title: 'Họ và tên',
            width: '20%',
            render: (text, record) => `${record.lastName} ${record.firstName}`,
            key: 'name',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            width: '8%',
            render: (text) => {
                switch (text) {
                    case "MALE":
                        return "Nam"
                    case "FEMALE":
                        return "Nữ"
                    default:
                        return "Khác"
                }
            },
            key: 'gender',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            width: '10%',
            key: 'phoneNumber',
            render: (text) => {
                if (text) {
                    return text
                } else
                    return (
                        <span><i>Không có dữ liệu</i></span>
                    );
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '20%',
            key: 'email',
            render: (text) => {
                if (text) {
                    return text
                } else
                    return (
                        <span><i>Không có dữ liệu</i></span>
                    );
            },
        },
        {
            title: 'Tài khoản',
            dataIndex: 'username',
            key: 'username',
            render: (text) => {
                if (text) {
                    return text
                } else
                    return (
                        <span><i>Không có dữ liệu</i></span>
                    );
            },
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            width: '8%',
            key: 'role',
            render: (text) => {
                if (text) {
                    return renderRole[text]
                } else
                    return (
                        <span><i>Chưa tham gia</i></span>
                    );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isAccountNonLocked',
            key: 'isAccountNonLocked',
            width: '15%',
            render: (text) => {
                return (
                    <div className={`flex items-center justify-center p-1 rounded-lg 
            border-2 
            ${text ? 'border-green-500 bg-white text-green-500' : 'border-red-500 bg-white text-red-500'} 
            border-gradient-to-r ${text ? 'from-green-300 to-green-700' : 'from-red-400 to-red-600'} 
            shadow-md transition-transform duration-300 transform hover:scale-105`}>
                        {text ? (
                            <div className="text-base font-semibold">Đang hoạt động</div>
                        ) : (
                            <div className="text-base font-semibold">Đã bị khóa</div>
                        )}
                    </div>
                );
            },

        },
    ];

    const isRider = (role)=>{
        switch (role){
            case 'EASY_RIDER':
                return true
            case 'TOUR_GUIDE':
                return true
            case 'MANAGER':
                return false
            case 'ADMIN':
                return false
        }
    }

    const handleValuesChange = (changedValues, allValues) => {
        if (changedValues.role) {
            console.log()
                setIsModalHaveRiderInfor(isRider(changedValues.role))
        }
    };

    const onShowSizeChange = (current, size) => {
        setPageSize(size);
        setPageNumber(1);
    };

    useEffect(() => {
        fetchListPassengers()
    }, []);
    useEffect(() => {
        fetchListPassengers()
    }, [pageNumber,pageSize]);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex flex-row h-[100px] items-center justify-center select-none">
                <div className="w-[95%] flex flex-row items-center gap-20">
                    <div className="flex flex-row">
                        <input
                            className="h-[38px] w-[400px] rounded-bl-[8px] text-[16px]
                            rounded-tl-[8px] text-black pl-3 !outline-none "
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="inline flex bg-[#4CAF50] hover:bg-[#4CAF50CC] justify-center items-center rounded-br-[8px] px-[15px] cursor-pointer text-white hover:text-neutral-100
                            rounded-tr-[8px] ">
                            <SearchOutlined className="text-[25px]" onClick={handleSearch}/>
                        </div>
                    </div>
                    <div className="inline">
                        <Button type="primary"
                                className="w-[200px] h-[38px]"
                                onClick={showModal}>
                            Thêm mới người dùng
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col  flex-grow items-center justify-center">
                <div className="w-[95%]">
                    <Table  bordered={true} className="shadow-md h-[500px]  bg-white cursor-pointer "
                            scroll={{ y: 'calc(100vh - 250px)' }}
                            dataSource={listPassengers}
                            pagination={false} columns={columns}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: () => {
                                        if(record.role == 'EASY_RIDER' ||record.role == 'TOUR_GUIDE') {
                                            handleClickDetailRider(record)
                                        }
                                    }
                                };
                            }}
                    />
                </div>
                <Pagination rootClassName="my-4" align="start" onChange={onChangePageNumber}
                            current={pageNumber}
                            pageSize={pageSize}
                            defaultCurrent={pageNumber}
                            showSizeChanger
                            onShowSizeChange={onShowSizeChange}
                            total={totalItem}/>
            </div>
            <Modal title="Thêm mới người dùng" width={isModalHaveRiderInfor?1200:600}  open={isModalCreatePassengerOpen} onCancel={handleCancel} footer={null}>
                <UserCreationForm isModalHaveRiderInfor={isModalHaveRiderInfor}  handleValuesChange={handleValuesChange} refreshData={fetchListPassengers} form={form}/>
            </Modal>

            <Modal
                width={1200}
                open={isOpenDetailModal}
                onCancel={() => setIsOpenDetailModal(false)}
                footer={null}>
                {currentDetaRider?
                    <DetailRiderInfor changeIsLockUser={changeIsLockUser} refreshData={fetchListPassengers} rider = {currentDetaRider} />
                    :''
                }
            </Modal>
        </div>
    )
}

export default UserManagementPage;