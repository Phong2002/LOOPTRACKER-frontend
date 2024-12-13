import {Button, ConfigProvider, Input, message} from "antd";
import ImageUploadButton from "../common/ImageUploadButton.jsx";
import messageError from "../../utils/MessageError.jsx";
import {useState} from "react";
import ApiService from "../../service/ApiService.jsx";
function CreateItemForm(props) {
    const [errorMess,setErrorMess] = useState("");
    const [name,setName] = useState("");
    const [image,setImage] = useState()
    const [quantity,setQuantity] = useState()
    const [messageApi, contextHolder] = message.useMessage();

    const postNewItem = async () => {
        messageApi.open({
            key:"post-item",
            type: 'loading',
            content: 'Loading...',
        });
        try {
            const dataForm = new FormData();
            dataForm.append('name', name);
            dataForm.append("image",image)
            dataForm.append("quantity",quantity??0)

            const response = await ApiService.postFormData("/item/create", dataForm)
            console.log("=====================",response)
            if(response){
                setName(null)
                setImage(null)
                setQuantity(null)
                props.refreshData()
                messageApi.open({
                    key:"post-item",
                    type: 'success',
                    content: 'Thêm đồ trang bị mới thành công !',
                });
            }
        }
        catch (error){
            console.log(error)
            messageApi.open({
                key:"post-item",
                type: 'error',
                content: 'Thêm đồ trang bị mới thất bại!',
            });
        }
    };

    const handleCreateNewItem = ()=>{
        setErrorMess("")
        if(name==""){
            setErrorMess("Tên đồ trang bị không được để trống !")
            return;
        }
        postNewItem()
    }

    return (
        <div className="h-[500px]">
            {contextHolder}
            <div className="flex flex-col gap-3">
                <div>
                    <label htmlFor="name">Tên đồ trang bị :</label>
                    <Input value={name} id="name" onChange = {e=>setName(e.target.value)}/>
                </div>
                <div className="flex justify-center items-center my-4">
                    <div className="w-[250px] h-[250px]">
                        <ImageUploadButton inputId="fileCCCDInputFront"
                            onImageChange={(value) => setImage(value)}
                            value={image}
                                           width={'250px'}
                                           height={'250px'}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="quantity">Số lượng ban đầu :</label>
                    <Input value={quantity} onChange={e=>setQuantity(e.target.value)} id="quantity" type="number"/>
                </div>
                <div className="h-[20px] flex justify-center items-center ">
                    <div className="text-red-500">{errorMess}</div>
                </div>
                <div className="flex justify-center flex-row gap-4">
                    <div>
                        <Button type="primary" onClick={handleCreateNewItem} className="w-[100px]" ghost>Tạo</Button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default CreateItemForm;