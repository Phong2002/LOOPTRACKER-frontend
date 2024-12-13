import { useEffect, useState } from "react";
import apiService from "../../service/ApiService.jsx";
import {Button, ConfigProvider, Form, message, Popconfirm} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import ApiService from "../../service/ApiService.jsx";

function DetailPassenger(props) {
    const [isEdit,setIsEdit] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const generateGender = {
        MALE: "Nam",
        FEMALE: "Nữ",
        OTHER: "Khác"
    }

    const turnOnEditMode = ()=>{
        setIsEdit(true)
    }

   const turnOffEditMode = ()=>{
        setIsEdit(false)
   }

   const confirmDeletePassenger = async () => {
       messageApi.open({
           key: "delete-passenger",
           type: 'loading',
           content: 'Loading...',
       });
       try {
           const id = {
               id:props.currentDetailPassenger.id
           }

           const response = await ApiService.delete("/passenger/delete", id)
           console.log("=====================", response)
           if (response) {
               props.closeModal()
               props.refreshData()
               messageApi.open({
                   key: "delete-passenger",
                   type: 'success',
                   content: 'Xóa hành khách thành công !',
               });
           }
       } catch (error) {
           console.log(error)
           messageApi.open({
               key: "delete-passenger",
               type: 'error',
               content: 'Xóa hành khách thất bại !',
           });
       }
   }


    const tourInstanceStatus = {
        PREPARING: "Chuẩn bị",
        IN_PROGRESS: "Đang trong chuyến",
        COMPLETED: "Đã hoàn thành"
    };

    const InfoBlock = ({ label, value }) => (
        <div className="flex flex-row items-center bg-gray-50 p-3 rounded-lg shadow-md border-l-4 border-green-500 transform transition duration-500 hover:scale-105 hover:shadow-xl hover:bg-green-50">
            <div className="font-semibold text-gray-700 w-[100px] pr-[10px]">
                {label}:
            </div>
            <div className="text-gray-900 w-auto">
                {value}
            </div>
        </div>
    );

    const InfoBlockTour = ({ label, value }) => (
        <div className="flex flex-row items-center bg-gray-50 p-3 rounded-lg shadow-md border-l-4 border-green-500 transform transition duration-500 hover:scale-105 hover:shadow-xl hover:bg-green-50">
            <div className="font-semibold text-gray-700 w-[115px] pr-[10px]">
                {label}:
            </div>
            <div className="text-gray-900 ">
                {value}
            </div>
        </div>
    );

    return (

        <div className="flex flex-row justify-evenly h-[85vh] overflow-y-scroll py-2 bg-gray-100 text-gray-900">
            {contextHolder}
            <div className="flex  overflow-y-scroll flex-col gap-6 border-[1px] bg-white p-6 rounded-lg shadow-lg w-[400px] transition-all duration-300 hover:bg-gray-50 hover:shadow-2xl">
                <div className="font-bold text-[24px] text-gray-800 border-b-2 border-green-500 pb-2">
                    Thông tin hành khách
                </div>
                <InfoBlock label="Họ và tên" value={`${props.currentDetailPassenger?.passengerLastName} ${props.currentDetailPassenger?.passengerFirstName}`} />
                <InfoBlock label="Giới tính" value={generateGender[props.currentDetailPassenger?.passengerGender ?? "Không có dữ liệu"]} />
                <InfoBlock label="Số điện thoại" value={props.currentDetailPassenger?.passengerPhoneNumber ?? "Không có dữ liệu"} />
                <InfoBlock label="Email" value={props.currentDetailPassenger?.passengerEmail ?? "Không có dữ liệu"} />
                <InfoBlock label="Ghi chú" value={props.currentDetailPassenger?.passengerNotes ?? "Không có dữ liệu"} />
                <InfoBlock label="Trạng thái" value={tourInstanceStatus[props.currentDetailPassenger?.status] ?? "Chưa tham gia"} />
                <div>
                    {!isEdit ?
                        <span className="flex flex-row gap-4 justify-center items-center w-full">
                            {/*<Button className="my-4" onClick={turnOnEditMode}>*/}
                            {/*    Chỉnh sửa*/}
                            {/*</Button>*/}
                            {props.currentDetailPassenger?.status==null?
                                <ConfigProvider theme={{token: {colorPrimary: '#ff0000'},}}>
                                    <Popconfirm
                                        title="Xóa gói tour"
                                        description={`Bạn có chắc chắn muốn xóa hành khách này ?`}
                                        icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                        // open={open}
                                        // onOpenChange={handleOpenChange}
                                        onConfirm={confirmDeletePassenger}
                                        // onCancel={cancel}
                                        okText="Xóa"
                                        cancelText="Không"
                                    >
                                        <Button danger>Xóa hành khách</Button>
                                    </Popconfirm>
                                </ConfigProvider>
                                :
                                ''
                            }

                    </span>
                        :
                        <div className="flex flex-row gap-4 justify-center items-center w-full">
                                <Button  type="primary" className="my-4" onClick={() => {
                                    console.log("ok")
                                }}>
                                    Cập nhật
                                </Button>
                                <Button className="my-4" onClick={turnOffEditMode}>
                                    Hủy
                                </Button>
                        </div>
                    }
                </div>
            </div>

            <div className={`${props.currentDetailPassenger?.tourPackageName ? "w-[600px] h-full overflow-scroll overflow-x-hidden" : 'w-[300px]'} border-[1px] p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-2xl`}>
                <div className="font-bold text-[24px] text-gray-800 border-b-2 border-green-500 pb-2">
                    Chi tiết chuyến đi
                </div>
                <div>
                    {props.currentDetailPassenger?.tourPackageName ?
                        (
                            <div className="flex flex-col gap-6 mt-[20px]">
                                <InfoBlockTour label="Tên gói tour" value={props.currentDetailPassenger?.tourPackageName} />
                                <InfoBlockTour label="Thời gian" value={`${props.currentDetailPassenger?.tourPackageDay} Ngày ${props.currentDetailPassenger?.tourPackageNight} Đêm`} />
                                <InfoBlockTour label="Mô tả" value={props.currentDetailPassenger?.tourPackageDescription} />
                                <InfoBlockTour label="Khởi hành ngày" value={props.currentDetailPassenger?.startDate} />
                                <InfoBlockTour label="Kết thúc ngày" value={props.currentDetailPassenger?.endDate} />
                                <InfoBlockTour label="Hướng dẫn viên" value={props.currentDetailPassenger?.guideFirstName ? `${props.currentDetailPassenger?.guideLastName} ${props.currentDetailPassenger?.guideFirstName}` : "Chưa có thông tin"} />
                                <InfoBlockTour label="Easy rider" value={props.currentDetailPassenger?.riderFirstName ? `${props.currentDetailPassenger?.riderLastName} ${props.currentDetailPassenger?.riderFirstName}` : "Chưa có thông tin"} />
                            </div>
                        )
                        :
                        <div className="text-gray-700">Không có dữ liệu</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default DetailPassenger;
