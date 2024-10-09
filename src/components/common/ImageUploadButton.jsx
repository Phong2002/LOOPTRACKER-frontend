// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
function ImageUploadButton({ onImageChange, buttonText = "+ Thêm ảnh", className, inputId, value }) {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (value) {
            const imageUrl = URL.createObjectURL(value); // Tạo URL tạm cho file được truyền vào
            setSelectedImage(imageUrl); // Cập nhật ảnh vào state nếu có file
        }
    }, [value]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Tạo URL tạm cho ảnh mới
            setSelectedImage(imageUrl); // Cập nhật ảnh vào state
            if (onImageChange) {
                onImageChange(file); // Gọi hàm callback khi có ảnh mới
            }
        }
    };

    return (
        <div className="flex justify-center items-center">
            {/* Input file với id duy nhất */}
            <input
                type="file"
                id={inputId} // Sử dụng id duy nhất được truyền vào
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />

            {/* Button với hình ảnh */}
            <label htmlFor={inputId}>
                <div
                    className={`w-[200px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer ${className}`}
                    style={{
                        backgroundImage: selectedImage ? `url(${selectedImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {!selectedImage && <span>{buttonText}</span>}
                </div>
            </label>
        </div>
    );
}

export default ImageUploadButton;
