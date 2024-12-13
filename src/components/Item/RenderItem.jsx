import {Card, Modal, Spin, message, Button, Select} from "antd";
import {useEffect, useState} from "react";
import ApiService from "../../service/ApiService.jsx";
import {Checkbox, Form, Input} from 'antd';

function RenderItem({item, refreshData}) {
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const host = import.meta.env.VITE_SERVER_HOST;
    const prefix = import.meta.env.VITE_SERVER_PREFIX;
    const baseURL = `${apiUrl}:${host}/${prefix}/file/image/download`;
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportExportModal, setIsImportExportModal] = useState(false);
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importExportForm] = Form.useForm();
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await ApiService.get(`/item-movement/get-by-id/${item.id}`);
            setHistories(data.content);
        } catch (e) {
            message.error("Failed to fetch history data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelModalImportExport = () => {
        setIsImportExportModal(false);
        importExportForm.resetFields()
    }

    const handleImportExport = (e) => {
        e.stopPropagation();
        setIsImportExportModal(true)
    }

    const handleDeleteItem = async (e) => {
        e.stopPropagation();
        messageApi.open({
            key: "delete-item",
            type: 'loading',
            content: 'Loading...',
        });
        try {
            const id = {
                id: item.id
            }
            const response = await ApiService.delete("/item/delete", id)
            if (response) {
                refreshData()
                messageApi.open({
                    key: "delete-item",
                    type: 'success',
                    content: 'Xóa đồ trang bị thành công !',
                });
            }
        } catch (error) {
            console.log(error)
            messageApi.open({
                key: "delete-item",
                type: 'error',
                content: 'Xóa đồ trang bị thất bại!',
            });
        }
    }

    const onFinish = async (values) => {
        let data = {
            itemId: item.id,
            description: values.description,
            quantity: values.quantity
        }

        messageApi.open({
            key: "send-request",
            type: 'loading',
            content: 'Loading...',
        });

        try {
            const response = await ApiService.post(`/item-movement/${values.type == 'import' ? 'add' : 'remove'}`, data)
            if (response) {
                refreshData()
                messageApi.open({
                    key: "send-request",
                    type: 'success',
                    content: `${values.type == 'import' ? 'Nhập ' : 'Xuất'} trang bị mới thành công!`,
                });
            }
        } catch (error) {
            console.log("=============================", error)
            messageApi.open({
                key: "send-request",
                type: 'error',
                content: `${values.type == 'import' ? 'Nhập ' : 'Xuất'} trang bị mới thất bại!`,
            });
        }
    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const formatter = new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    });

    useEffect(() => {
        if (isModalOpen) fetchHistory();
    }, [isModalOpen]);

    return (
        <div>
            {contextHolder}
            <Card
                onClick={showModal}
                hoverable
                bordered={false}
                className="bg-white text-neutral-800 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
                <img
                    alt={item.name}
                    src={`${baseURL}/${item.image}`}
                    className="h-64 w-full object-cover rounded-lg"
                />
                <div>

                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-green-800">{item.name}</h2>
                        <p className="text-md">
                            Tổng số: <span
                            className="font-bold text-green-700">{item.totalImport - item.totalExport  ?? "Chưa có dữ liệu"}</span>
                        </p>
                        <p className="text-md">
                            Đang sử dụng: <span
                            className="font-bold text-green-700">{item.totalBorrowing ?? "Chưa có dữ liệu"}</span>
                        </p>
                        <p className="text-md">
                            Còn lại: <span
                            className="font-bold text-green-700">{item.totalImport - item.totalExport - item.totalBorrowing}</span>
                        </p>
                    </div>
                    <div className='flex justify-center items-center gap-2'>
                        <Button onClick={handleImportExport} type="primary" ghost={true}>Nhập/Xuất</Button>
                        {!item.totalImport ?
                            <Button onClick={handleDeleteItem} type="primary" danger={true} ghost={true}>Xóa</Button>
                            :
                            ''
                        }
                    </div>
                </div>
            </Card>

            <Modal
                title={
                    <div className="flex justify-center items-center space-x-2">
      <span className="text-xl font-extrabold text-green-900">
        Lịch sử nhập/xuất
      </span>
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}

            >
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spin size="large"/>
                    </div>
                ) : (
                    <div className="space-y-4 h-[65vh] overflow-y-scroll ">
                        {histories.map((history, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-lg shadow-lg border-l-4 transition-all duration-300 ${
                                    history.type === "ADDED"
                                        ? 'border-green-500 bg-green-50 hover:bg-green-100'
                                        : 'border-red-500 bg-red-50 hover:bg-red-100'
                                }`}
                            >
                                <div className="flex items-center  px-3 py-1">
                                    <p className="text-lg font-bold text-gray-800 flex-1">
                                        Số lượng: <span
                                        className="font-semibold text-green-700">{history.quantity}</span>
                                    </p>
                                    <span className="text-sm text-gray-500">
              {formatter.format(new Date(history.time))}
            </span>
                                </div>
                                <p className={`text-md px-3 py-1 font-bold rounded ${
                                    history.type === "ADDED" ? 'text-green-800 ' : 'text-red-800 '
                                }`}>
                                    Hành động:
                                    {history.type === "ADDED" ? " Thêm vào" : " Bỏ ra"}
                                </p>
                                <p className="text-md px-3 py-1 text-gray-600">
                                    Ghi chú: {history.description || "Không có"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>


            <Modal
                width={600}
                title={<span
                    className="text-xl flex justify-center font-bold text-green-800">Nhập/Xuất đồ trang bị</span>}
                open={isImportExportModal}
                onCancel={handleCancelModalImportExport}
                footer={null}
                style={{borderRadius: "16px"}}
            >
                <Form
                    form={importExportForm}
                    name="importExportItemForm"
                    labelCol={{
                        span: 4,
                    }}

                    initialValues={{
                        'type': 'import',
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Sản phẩm"
                        name="itemName"
                    >
                        {item.name}
                    </Form.Item>

                    <Form.Item
                        label="Hành động"
                        name="type"
                        initialValue={'import'}

                    >
                        <Select
                            defaultValue={'import'}
                            options={[
                                {value: "import", label: "Nhập trang bị"},
                                {value: "export", label: "Xuất trang bị"},
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số lượng !',
                            },
                        ]}
                    >
                        <Input type='number'/>
                    </Form.Item>

                    <Form.Item
                        label="Ghi chú"
                        name="description"
                    >
                        <Input.TextArea/>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default RenderItem;
