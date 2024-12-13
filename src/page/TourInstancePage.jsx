import {Button, Form, Modal, Pagination, Select, Table} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import ApiService from "../service/ApiService.jsx";
import CreateTourInstanceForm from "../components/tourInstance/CreateTourInstanceForm.jsx";
import DetailTourInstanceForm from "../components/tourInstance/DetailTourInstanceForm.jsx";

const tourInstanceStatus = {
    PREPARING: "Chuẩn bị",
    IN_PROGRESS: "Đang trong chuyến",
    COMPLETED: "Đã hoàn thành"
};

const columns = [
    {
        title: 'Tên nhóm',
        render: (text, record) => `${record?.name ?? ''} `,
        key: 'name',
    },
    {
        title: 'Tên gói tour',
        width: '20%',
        render: (text, record) => `${record?.tourPackageName ?? ''} `,
        key: 'tourPackageName',
    },
    {
        title: 'Thời gian',
        width: '8%',
        render: (text, record) => `${record?.day ?? '0'} Ngày ${record?.night ?? "0"} Đêm`,
        key: 'time',
    },
    {
        title: 'Ngày khởi hành',
        dataIndex: 'startDate',
        width: '10%',
        key: 'startDate',
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
        title: 'Ngày kết thúc',
        dataIndex: 'endDate',
        width: '10%',
        key: 'endDate',

    },
    {
        title: 'Hướng dẫn viên',
        width: '15%',
        key: 'tour_guide',
        render: (text, record) => {
            if (record?.tourGuideId) {
                return `${record?.tourGuideLastName} ${record?.tourGuideFirstName}`
            } else {
                return <span><i>Không có dữ liệu</i></span>
            }
        },
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: (text) => {
            if (text) {
                return tourInstanceStatus[text]
            } else
                return (
                    <span><i>Không có dữ liệu</i></span>
                );
        },
    },
    {
        title: 'Tổng số tài xế',
        dataIndex: 'totalRider',
        width: '8%',
        key: 'totalRider',

    },
    {
        title: 'Tổng số hành khách',
        dataIndex: 'totalPassenger',
        width: '8%',
        key: 'totalPassenger',

    },
];


function TourInstancePage() {
    const [listTourInstance, setListTourInstance] = useState([]);
    const [isModalCreateTourInstance, setIsModalCreatePassengerOpen] = useState(false);
    const [tourPackage, setTourPackage] = useState()
    const [listTourPackage, setListTourPackage] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [totalItem, setTotalItem] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [form] = Form.useForm();
    const [status, setStatus] = useState('')
    const [isOpenDetailModal, setIsOpenDetailModal] = useState(false)
    const [currentDetailTourInstance, setCurrentDetailTourInstance] = useState()
    const [search, setSearch] = useState('')

    const fetchListPackage = async () => {
        try {
            const data = await ApiService.get("/tour-package/get-all?sort=update_at,desc&size=1000")
            const listPackages = data?.content?.map((tourPackage) => {
                return {
                    value: tourPackage.id,
                    label: tourPackage.tourName
                }
            })
            setListTourPackage(listPackages)
        } catch (e) {
            console.log(e)
        }

    }

    const fetchListTourInstance = async () => {
        const param = {
            sort: "id,desc",
            size: pageSize,
            page: pageNumber - 1,
            search: search.replace(/\s+/g, ' ').trim(),
        }
        if (status) {
            param.status = status
        }
        if (tourPackage) {
            param.tourPackage = tourPackage
        }
        const data = await ApiService.get("/tour-instance/get-all", param)
        setListTourInstance(data.content)
        setTotalItem(data.totalElements)
    }


    const handleSearch = () => {
        // if(search.replace(/\s+/g, ' ').trim()){
        setPageNumber(0)
        fetchListTourInstance()
        // }

    }

    const handleChangeTourPackage = (tourPackage) => {
        setPageNumber(0)
        setTourPackage(tourPackage.value)
    }

    const handleChangeTourStatus = (status) => {
        setPageNumber(0)
        setStatus(status)
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
    }

    const handleViewDetailTourInstance = (currentData) => {
        setCurrentDetailTourInstance(currentData.id);
        setIsOpenDetailModal(true)
    }

    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
        setPageSize(pageSize)
    };

    useEffect(() => {
        fetchListTourInstance()
        fetchListPackage()
    }, []);

    useEffect(() => {
        fetchListTourInstance()
    }, [pageNumber, status, tourPackage,pageSize]);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex  flex-row h-[100px] items-center justify-center select-none">
                <div className="w-[95%] flex flex-row items-center justify-between">
                    <div className="flex flex-row">
                        <input
                            className="h-[38px] w-[280px] rounded-bl-[8px] text-[16px]
                            rounded-tl-[8px] text-black pl-3 !outline-none "
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="inline flex justify-center items-center  rounded-br-[8px] px-[15px] cursor-pointer text-white hover:text-neutral-100
                            rounded-tr-[8px] bg-[#4CAF50] hover:bg-[#4CAF50CC] ">
                            <SearchOutlined className="text-[25px]" onClick={handleSearch}/>
                        </div>
                    </div>
                    <div className="inline">
                        <label htmlFor="changeTourPackage">Gói tour: </label>
                        <Select
                            labelInValue
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            showSearch
                            id="changeTourPackage"
                            defaultValue={null}
                            style={{width: 300, height: 38}}
                            onChange={handleChangeTourPackage}
                            options={[{value: null, label: 'Toàn bộ'}, ...listTourPackage]}/>
                    </div>
                    <div className="inline">
                        <label htmlFor="handleChangeStatus">Trạng thái: </label>
                        <Select
                            id="handleChangeStatus"
                            defaultValue=""
                            style={{width: 200, height: 38}}
                            onChange={handleChangeTourStatus}
                            options={[
                                {value: '', label: 'Toàn bộ'},
                                {value: 'PREPARING', label: 'Đang chuẩn bị'},
                                {value: 'IN_PROGRESS', label: 'Đang trong chuyến đi'},
                                {value: 'COMPLETED', label: 'Chuyến đi đã kết thúc'}
                            ]}/>
                    </div>
                    <div className="inline">
                        <Button type="primary"
                                className="w-[200px] h-[38px]"
                                onClick={showModal}
                        >
                            Thêm mới chuyến đi
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-grow items-center justify-between bg-gray-100">
                <div className="w-[95%] h-full overflow-auto">
                    <Table
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: () => {
                                    handleViewDetailTourInstance(record)
                                }
                            };
                        }}
                        rowKey={'id'}
                        scroll={{y: 'calc(100vh - 250px)'}} // Adjust height dynamically
                        bordered={true} className="shadow-md bg-white " dataSource={listTourInstance}
                        pagination={false}
                        columns={columns}
                    />
                </div>
                <Pagination rootClassName="my-4" align="start" onChange={onChangePageNumber}
                            current={pageNumber}
                            pageSize={pageSize}
                            showSizeChanger
                            onShowSizeChange={onShowSizeChange}
                            defaultCurrent={pageNumber}
                            total={totalItem}
                />
            </div>
            <Modal
                width={1200}
                title="Thêm mới chuyến đi" open={isModalCreateTourInstance} onCancel={handleCancel} footer={null}>
                <CreateTourInstanceForm form={form}/>
            </Modal>
            <Modal
                width={1200}
                open={isOpenDetailModal}
                onCancel={() => setIsOpenDetailModal(false)}
                footer={null}>
                {currentDetailTourInstance ?
                    <DetailTourInstanceForm refreshData={fetchListTourInstance}
                                            closeModal={() => setIsOpenDetailModal(false)}
                                            tourInstanceId={currentDetailTourInstance}/>
                    : ''
                }
            </Modal>
        </div>
    )
}

export default TourInstancePage;