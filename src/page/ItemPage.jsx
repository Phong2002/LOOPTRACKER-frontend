import { Button, Modal } from "antd";
import ApiService from "../service/ApiService.jsx";
import { useEffect, useState } from "react";
import RenderItem from "../components/Item/RenderItem.jsx";
import CreateItemForm from "../components/Item/CreateItemForm.jsx";

function ItemPage() {
    const [listItems, setListItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const fetchListItems = async () => {
        const param = { sort: "create_at,desc", size: 1000 };
        const data = await ApiService.get("/item/get-all", param);
        setListItems(data.content);
    };

    useEffect(() => {
        fetchListItems();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-100 text-neutral-800 flex flex-col items-center py-12">
            <div className="flex justify-between items-center w-full max-w-6xl px-8 mb-12">
                <h1 className="text-4xl font-bold text-lime-600">Danh sách đồ trang bị</h1>
                <Button
                    type="primary"
                    className="bg-lime-600 text-white rounded-lg shadow-md hover:bg-lime-700 transition-all"
                    onClick={showModal}
                >
                    + Thêm đồ trang bị mới
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-6xl">
                {listItems.map((item) => (
                    <RenderItem  key={item.id} refreshData={fetchListItems} item={item} />
                ))}
            </div>

            <Modal
                title={
                    <span className="text-2xl font-extrabold text-lime-600">Thêm đồ trang bị mới</span>
                }
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={600}
                style={{ borderRadius: "16px" }}
            >
                <CreateItemForm refreshData={fetchListItems} />
            </Modal>
        </div>
    );
}

export default ItemPage;
