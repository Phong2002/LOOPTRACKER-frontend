// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

// eslint-disable-next-line react/prop-types
function ImageUploadButton({ onImageChange, buttonText = "+ Thêm ảnh", className, inputId, value, width = '190px', height = '120px' }) {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (value) {
            const imageUrl = URL.createObjectURL(value); // Tạo URL tạm cho file được truyền vào
            setSelectedImage(imageUrl); // Cập nhật ảnh vào state nếu có file
        }
    }, [value]);

    const handleImageUpload = async (file) => {
        const imageUrl = URL.createObjectURL(file); // Tạo URL tạm cho ảnh mới
        setSelectedImage(imageUrl); // Cập nhật ảnh vào state
        if (onImageChange) {
            onImageChange(file); // Gọi hàm callback khi có ảnh mới
        }
    };

    const removeImage = () => {
        setSelectedImage(null); // Xóa ảnh đã chọn
        if (onImageChange) {
            onImageChange(null); // Gọi hàm callback với giá trị null
        }
    };

    return (
        <div className="relative flex justify-center items-center">
            <ImgCrop modalWidth={'60vw'} modalTitle="Chỉnh sửa ảnh" rotationSlider aspect={(parseInt(width, 10)??190)/(parseInt(height, 10)??120)}>
                <Upload
                    beforeUpload={(file) => {
                        handleImageUpload(file);
                        return false; // Ngăn không cho Upload tự động
                    }}
                    showUploadList={false} // Không hiển thị danh sách tải lên
                >
                    <label htmlFor={inputId}>
                        <div
                            className={`rounded-lg ${selectedImage ? "" : "border-gray-500 border-dashed border-[2px]"} bg-gray-200 flex items-center justify-center cursor-pointer ${className}`}
                            style={{
                                width: width ?? 190,
                                height: height ?? 120,
                                backgroundImage: selectedImage ? `url(${selectedImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {!selectedImage && <span>{buttonText}</span>}
                        </div>
                    </label>
                </Upload>
            </ImgCrop>

            {/* Nút x để bỏ ảnh */}
            {selectedImage && (
                <button
                    onClick={removeImage}
                    className="absolute top-0 flex justify-center items-center
                    text-[20px] pb-[1px] w-[24px] h-[24px]
                    right-0 text-neutral-700 rounded-full
                    bg-neutral-50 border-[1px]
                    "
                    aria-label="Remove image"
                >
                    &times;
                </button>
            )}
        </div>
    );
}

export default ImageUploadButton;
