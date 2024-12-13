import { useEffect, useState } from "react";
import { Button, ConfigProvider, Form, Modal, Pagination, Select, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ApiService from "../service/ApiService.jsx";
import "../index.css"
import TourPackageCreationForm from "../components/tourPackage/TourPackageCreationForm.jsx";
import DetailTourPackageForm from "../components/tourPackage/DetailTourPackageForm.jsx";

function TourPackagePage() {
    const [listTourPackage, setListTourPackage] = useState([]);
    const [isModalCreateTourPackageOpen, setIsModalCreateTourPackageOpen] = useState(false);
    const [isModalDetailTourPackageOpen, setIsModalDetailTourPackageOpen] = useState(false);
    const [form] = Form.useForm();
    const [detailForm] = Form.useForm();
    const [search, setSearch] = useState('');
    const [day, setDay] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [currentDetailData, setCurrentDetailData] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const fetchListTourPackage = async () => {
        const param = {
            search: search.replace(/\s+/g, ' ').trim(),
            day: day,
            minPrice: minPrice,
            maxPrice: maxPrice,
            size: pageSize,
            page: pageNumber - 1,
            sort: "update_at,desc",
        };

        const data = await ApiService.get("/tour-package/get-all", param);
        setListTourPackage(data.content);
        setTotalItem(data.totalElements);
    };

    const handleSearch = () => {
        setPageNumber(1);
        fetchListTourPackage();
    };

    const handleViewDetail = (rowRecord) => {
        const tourPackage = {
            id: rowRecord.id,
            tourName: rowRecord.tourName,
            price: rowRecord.price,
            description: rowRecord.description,
            createAt: rowRecord.createAt,
        };
        const detailedItinerary = rowRecord.detailedItineraryDtoList;
        const dataForm = {
            tourPackage: tourPackage,
            detailedItinerary: detailedItinerary,
        };
        setCurrentDetailData(dataForm);
        setIsModalDetailTourPackageOpen(true);
        detailForm.setFieldsValue(dataForm);
    };

    const showModalCreateTourPackage = () => {
        setIsModalCreateTourPackageOpen(true);
    };

    const handleCancelModalCreateTourPackage = () => {
        setIsModalCreateTourPackageOpen(false);
        form.resetFields();
    };

    const handleCancelModalDetailTourPackage = () => {
        setIsModalDetailTourPackageOpen(false);
        detailForm.resetFields();
    };

    const onChangePageNumber = (page) => {
        setPageNumber(page);
    };

    const onShowSizeChange = (current, size) => {
        setPageSize(size);
        setPageNumber(1);
    };

    useEffect(() => {
        fetchListTourPackage();
    }, [pageNumber, pageSize]);

    const columns = [
        {
            title: 'Mã gói tour',
            dataIndex: 'id',
            key: 'id',
            width: '8%',
        },
        {
            title: 'Tên gói tour',
            dataIndex: 'tourName',
            key: 'tourName',
            width: '20%',
        },
        {
            title: 'Thời gian',
            width: '12%',
            render: (text, record) => `${record.day} Ngày ${record.night} Đêm`,
            key: 'time',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: '15%',
            render: (text) => `${text.toLocaleString()} VNĐ`,
            key: 'price',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text ? (
                <div className="h-[120px] custom-scrollbar overflow-y-scroll">
                    {text}
                </div>
            ) : (<span><i>Không có dữ liệu</i></span>),
        },
    ];

    return (
        <div className="h-screen flex flex-col">
            <div className="flex flex-row h-[100px] items-center justify-center select-none">
                <div className="w-[95%] flex flex-row items-center gap-6">
                    <div className="flex flex-row">
                        <input
                            className="h-[38px] w-[400px] rounded-bl-[8px] text-[16px]
                            rounded-tl-[8px] text-black pl-3 !outline-none"
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm theo tên gói tour..."
                        />
                        <div className="inline flex justify-center items-center bg-[#4CAF50] rounded-br-[8px] px-[15px] cursor-pointer text-white hover:text-neutral-100
                            rounded-tr-[8px] hover:bg-[#4CAF50CC]">
                            <SearchOutlined className="text-[25px]" onClick={handleSearch}/>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="tourDay" className="mr-2">Số ngày:</label>
                        <Select
                            id="tourDay"
                            style={{ width: 120, height: 38 }}
                            onChange={setDay}
                            value={day}
                            options={[
                                { value: '', label: 'Tất cả' },
                                { value: '1', label: '1 ngày' },
                                { value: '2', label: '2 ngày' },
                                { value: '3', label: '3 ngày' },
                                { value: '4', label: '4 ngày' },
                                { value: '5', label: '5 ngày' },
                            ]}
                        />
                    </div>
                    <Button
                        type="primary"
                        className="w-[200px] h-[38px] bg-[#4CAF50] border-none hover:bg-[#66BB6A]"
                        onClick={showModalCreateTourPackage}
                    >
                        Thêm mới gói tour
                    </Button>
                </div>
            </div>
            <div className="flex flex-col flex-grow items-center justify-between bg-gray-100">
                <div className="w-[95%] h-full overflow-auto">
                    <Table
                        bordered
                        className="shadow-md bg-white cursor-pointer custom-scrollbar"
                        dataSource={listTourPackage}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        scroll={{ y: 'calc(100vh - 250px)' }}
                        onRow={(record) => ({
                            onClick: () => handleViewDetail(record)
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
            <Modal
                title="Thêm mới gói tour"
                open={isModalCreateTourPackageOpen}
                onCancel={handleCancelModalCreateTourPackage}
                width={800}
                footer={null}
            >
                <TourPackageCreationForm refreshData={fetchListTourPackage} form={form} />
            </Modal>
            <Modal
                title="Chi tiết gói tour"
                open={isModalDetailTourPackageOpen}
                onCancel={handleCancelModalDetailTourPackage}
                width={800}
                footer={null}
            >
                <DetailTourPackageForm
                    closeModal={handleCancelModalDetailTourPackage}
                    refreshData={fetchListTourPackage}
                    form={detailForm}
                    currentData={currentDetailData}
                />
            </Modal>
        </div>
    );
}

export default TourPackagePage;