import {useEffect, useState} from "react";
import ApiService from "../service/ApiService.jsx";
import {Button, Form, Modal, Pagination, Select, Table} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import PassengerCreationForm from "../components/passenger/PassengerCreationForm.jsx";
import DetailPassenger from "../components/passenger/DetailPassenger.jsx";

const tourInstanceStatus = {
    PREPARING: "Chuẩn bị",
    IN_PROGRESS: "Đang trong chuyến",
    COMPLETED: "Đã hoàn thành"
};

function PassengerPage() {
    const [listPassengers, setListPassengers] = useState([]);
    const [isModalCreatePassengerOpen, setIsModalCreatePassengerOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [form] = Form.useForm();
    const [status, setStatus] = useState('');
    const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);
    const [currentDetailPassenger, setCurrentDetailPassenger] = useState();
    const [search, setSearch] = useState('');

    const fetchListPassengers = async () => {
        const param = {
            sort: "id,desc",
            size: pageSize,
            page: pageNumber - 1,
            search: search.replace(/\s+/g, ' ').trim(),
        };
        if (status) {
            param.status = status;
        }
        const data = await ApiService.get("/passenger/get-all", param);
        setListPassengers(data.content);
        setTotalItem(data.totalElements);
    };

    const handleClickDetailPassenger = (record) => {
        setCurrentDetailPassenger(record);
        setIsOpenDetailModal(true);
    };

    const handleSearch = () => {
        setPageNumber(1);
        fetchListPassengers();
    };

    const handleChangePassengerStatus = (status) => {
        setPageNumber(1);
        setStatus(status);
    };

    const showModal = () => {
        setIsModalCreatePassengerOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalCreatePassengerOpen(false);
    };

    const onChangePageNumber = (page) => {
        setPageNumber(page);
    };

    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
        setPageSize(pageSize)
    };

    useEffect(() => {
        fetchListPassengers();
    }, []);

    useEffect(() => {
        fetchListPassengers();
    }, [pageNumber, status, pageSize]);

    const columns = [
        {
            title: 'ID',
            width: '5%',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Họ và tên',
            width: '20%',
            render: (text, record) => `${record.passengerFirstName} ${record.passengerLastName}`,
            key: 'name',
        },
        {
            title: 'Giới tính',
            dataIndex: 'passengerGender',
            width: '8%',
            render: (text) => {
                switch (text) {
                    case "MALE":
                        return "Nam";
                    case "FEMALE":
                        return "Nữ";
                    default:
                        return "Khác";
                }
            },
            key: 'passengerGender',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'passengerPhoneNumber',
            width: '10%',
            key: 'passengerPhoneNumber',
            render: (text) => text ? text : (<span><i>Không có dữ liệu</i></span>),
        },
        {
            title: 'Email',
            dataIndex: 'passengerEmail',
            width: '20%',
            key: 'email',
            render: (text) => text ? text : (<span><i>Không có dữ liệu</i></span>),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'passengerNotes',
            key: 'notes',
            render: (text) => text ? text : (<span><i>Không có dữ liệu</i></span>),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '8%',
            key: 'status',
            render: (text) => text ? tourInstanceStatus[text] : (<span><i>Chưa tham gia</i></span>),
        }
    ];

    return (
        <div className="h-screen flex flex-col">
            <div className="flex flex-row h-[100px] items-center justify-center select-none">
                <div className="w-[95%] flex flex-row items-center gap-6">
                    <div className="flex flex-row">
                        <input
                            className="h-[38px] w-[400px] rounded-bl-[8px] text-[16px]
                            rounded-tl-[8px] text-black pl-3 !outline-none "
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="inline flex justify-center items-center bg-[#4CAF50] rounded-br-[8px] px-[15px] cursor-pointer text-white hover:text-neutral-100
                            rounded-tr-[8px] hover:bg-[#4CAF50CC] ">
                            <SearchOutlined className="text-[25px]" onClick={handleSearch}/>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="handleChangePassengerStatus" className="mr-2">Trạng thái:</label>
                        <Select
                            id="handleChangePassengerStatus"
                            defaultValue=""
                            style={{width: 200, height: 38}}
                            onChange={handleChangePassengerStatus}
                            options={[
                                {value: '', label: 'Toàn bộ'},
                                {value: 'PREPARING', label: 'Đang chuẩn bị'},
                                {value: 'IN_PROGRESS', label: 'Đang trong chuyến đi'},
                                {value: 'COMPLETED', label: 'Chuyến đi đã kết thúc'}
                            ]}
                        />
                    </div>
                    <Button type="primary" className="w-[200px] h-[38px] bg-[#4CAF50] border-none hover:bg-[#66BB6A]"
                            onClick={showModal}>
                        Thêm mới hành khách
                    </Button>
                </div>
            </div>
            <div className="flex flex-col flex-grow items-center justify-between bg-gray-100" id="full">
                <div className="w-[95%] h-full overflow-auto">
                    <Table
                        bordered
                        className="shadow-md bg-white cursor-pointer custom-scrollbar"
                        dataSource={listPassengers}
                        pagination={false}
                        columns={columns}
                        scroll={{y: 'calc(100vh - 250px)'}} // Adjust height dynamically
                        onRow={(record) => ({
                            onClick: () => handleClickDetailPassenger(record)
                        })}
                    />
                </div>
                <Pagination
                    className="my-4"
                    onChange={onChangePageNumber}
                    showSizeChanger
                    onShowSizeChange={onShowSizeChange}
                    current={pageNumber}
                    pageSize={pageSize}
                    total={totalItem}
                />
            </div>
            <Modal title="Thêm mới hành khách" open={isModalCreatePassengerOpen} onCancel={handleCancel} footer={null}>
                <PassengerCreationForm refreshData={fetchListPassengers} form={form}/>
            </Modal>
            <Modal
                bodyStyle={{height: '85vh'}}
                style={{top: 20}}
                width={currentDetailPassenger?.tourPackageName ? 1080 : 780}
                open={isOpenDetailModal}
                onCancel={() => setIsOpenDetailModal(false)}
                footer={null}
            >
                {currentDetailPassenger ? <DetailPassenger refreshData={fetchListPassengers}
                                                           closeModal={() => setIsOpenDetailModal(false)}
                                                           currentDetailPassenger={currentDetailPassenger}/> : null}
            </Modal>
        </div>
    );
}


export default PassengerPage;
