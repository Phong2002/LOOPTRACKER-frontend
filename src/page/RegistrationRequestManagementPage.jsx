import {SearchOutlined} from "@ant-design/icons";
import {Button, Empty, Modal, Pagination, Select, Table} from "antd";
import {useEffect, useState} from "react";
import ApiService from "../service/ApiService.jsx";
import RenderRegistrationRequest from "../components/account/RenderRegistrationRequest.jsx";

function RegistrationRequestManagementPage() {
    const [status, setStatus] = useState('PENDING')
    const [search, setSearch] = useState('')
    const [listRegistration,setListRegistration] = useState([])

    const fetchListRegistration = async () => {

        const param = {
            sort: "create_at,desc",
            size: 10000,
            search: search.replace(/\s+/g, ' ').trim(),
        }
        if (status) {
            param.status = status
        }

        const data = await ApiService.get("/registration-request/get-all", param)
        setListRegistration(data.content)
    }

    const handleSearch = () => {
        // if(search.replace(/\s+/g, ' ').trim()){
        fetchListRegistration()
        // }

    }

    const handleChangeRegistrationStatus = (status) => {
        console.log("=====================",status)
        setStatus(status)
    }

    useEffect(()=>{
        fetchListRegistration()
    },[])

    useEffect(()=>{
        fetchListRegistration()
    },[status])
    return (
        <div >
            <div className="flex flex-row h-[100px] items-center justify-center select-none">
                <div className="w-[80%] flex flex-row justify-center items-center gap-32">
                    <div className="flex flex-row">
                        <input
                            className="h-[38px] w-[400px] rounded-bl-[8px] text-[16px]
                            rounded-tl-[8px] text-black pl-3 !outline-none "
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="inline flex justify-center items-center rounded-br-[8px] px-[15px] cursor-pointer text-white hover:text-neutral-100
                            rounded-tr-[8px] bg-[#4CAF50] hover:bg-[#4CAF50CC] ">
                            <SearchOutlined className="text-[25px]" onClick={handleSearch}/>
                        </div>
                    </div>
                    <div className="inline">
                        <label htmlFor="handleChangePassengerStatus">Trạng thái: </label>
                        <Select
                            id="handleChangePassengerStatus"
                            defaultValue="PENDING"
                            style={{width: 200,height:38}}
                            onChange={handleChangeRegistrationStatus}
                            options={[
                                {value: '', label: 'Toàn bộ'},
                                {value: 'PENDING', label: 'Đang chờ duyệt'},
                                {value: 'APPROVED', label: 'Đã duyệt'},
                                {value: 'REJECTED', label: 'Đã từ chối'}
                            ]}/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center ">
                {listRegistration.length>0 ? <div className="max-h-[580px] overflow-y-scroll p-4 px-8 overflow-x-hidden">
                    {listRegistration.map((request) => {
                        return <RenderRegistrationRequest refreshData={fetchListRegistration} key={request.id} request={request}/>
                    })}
                </div>
                :
                    <div>
                        <Empty />
                    </div>
                }

            </div>
            {/*<Modal title="Thêm mới hành khách" open={isModalCreatePassengerOpen} onCancel={handleCancel} footer={null}>*/}
            {/*    <PassengerCreationForm form={form}/>*/}
            {/*</Modal>*/}

            {/*<Modal*/}
            {/*    width={currentDetailPassenger?.tourAssigment ? 1000 : 600}*/}
            {/*    height={200}*/}
            {/*    open={isOpenDetailModal}*/}
            {/*    onCancel={() => setIsOpenDetailModal(false)}*/}
            {/*    footer={null}>*/}
            {/*    {currentDetailPassenger ?*/}
            {/*        <DetailPassenger currentDetailPassenger={currentDetailPassenger}/>*/}
            {/*        : ''*/}
            {/*    }*/}
            {/*</Modal>*/}
        </div>
    )
}

export default RegistrationRequestManagementPage;