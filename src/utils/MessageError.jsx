// ErrorMessages.jsx
const ErrorMessages = {
    // ĐƠN ĐĂNG KÝ
    RR00001: "Đơn đăng ký không tồn tại",

    // GÓI TOUR
    TP_00001: "Mã gói tour đã tồn tại",
    TP_00002: "Gói tour không tồn tại",

    // THỰC THỂ TOUR
    TI_00001: "Thực thể tour không tồn tại",

    // PHÂN CÔNG TOUR
    TA_00001: "Phân công tour không tồn tại",

    // MÓN HÀNG
    IT_00001: "Món hàng không tồn tại",

    // PHÂN CÔNG MÓN HÀNG
    IT_00002: "Phân công món hàng không tồn tại",

    // HÀNH KHÁCH
    PA_00001: "Hành khách không tồn tại",

    // NGƯỜI LÁI XE
    RD_00001: "Người lái xe không tồn tại",
    RD_00002: "Hướng dẫn viên không tồn tại",
    RD_00003: "Phải có vai trò người lái xe",
    RD_00004: "Người lái xe đang tham gia tour khác",
    RD_00005: "Người lái xe chưa sẵn sàng",

    // THÔNG TIN NGƯỜI DÙNG
    UI_00001: "CCCD đã tồn tại",
    UI_00002: "Giấy phép lái xe đã tồn tại",
    UI_00003: "Email đã tồn tại",
    UI_00004: "Số điện thoại đã tồn tại",

    // VAI TRÒ
    RL_00001: "Phải có vai trò quản trị viên",
    RL_00002: "Phải có vai trò quản lý",
    RL_00003: "Phải có vai trò hướng dẫn viên",
    RL_00004: "Phải có vai trò người lái xe dễ",

    // HÀNH ĐỘNG
    AC_00001: "Không thể xóa",
};

export const getErrorMessage = (code) => {
    return ErrorMessages[code] || "Lỗi";
};

export default ErrorMessages;
