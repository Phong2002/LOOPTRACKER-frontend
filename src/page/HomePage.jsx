import React from 'react';
import { Layout, Button, Card, Col, Row, Statistic } from 'antd';
import { TeamOutlined, GlobalOutlined, SafetyCertificateOutlined, LineChartOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;

const HomePage = () => {
    return (
        <Content className="bg-white p-10">
            {/* Key Metrics Section */}
            <section className="mb-10">
                <h2 className="text-5xl font-semibold text-green-600 mb-4 text-center">Thống Kê Quan Trọng</h2>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card
                            className="text-center shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
                            <TeamOutlined className="text-5xl text-green-600 mb-4"/>
                            <h3 className="text-2xl font-semibold mb-2">Tổng Số Hành Khách</h3>
                            <Statistic value={120} suffix="người"/>
                            <p className="text-gray-500 mt-2">Số hành khách đã đăng ký tham gia tour.</p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            className="text-center shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
                            <GlobalOutlined className="text-5xl text-green-600 mb-4"/>
                            <h3 className="text-2xl font-semibold mb-2">Số Tour Đang Hoạt Động</h3>
                            <Statistic value={10} suffix="tour"/>
                            <p className="text-gray-500 mt-2">Số tour hiện tại đang được quản lý.</p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            className="text-center shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
                            <SafetyCertificateOutlined className="text-5xl text-green-600 mb-4"/>
                            <h3 className="text-2xl font-semibold mb-2">Số Đồ Trang Bị</h3>
                            <Statistic value={150} suffix="món"/>
                            <p className="text-gray-500 mt-2">Tổng số đồ trang bị hiện có cho các tour.</p>
                        </Card>
                    </Col>
                </Row>
            </section>

            {/* Detailed Statistics Section */}
            <section className="mb-10">
                <h2 className="text-5xl font-semibold text-green-600 mb-4 text-center">Thống Kê & Báo Cáo Chi Tiết</h2>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card className="shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Biểu Đồ Hành Khách Theo Tháng</h3>
                            {/* Placeholder for Chart Component */}
                            <div style={{height: '300px', backgroundColor: '#f0f0f0'}}>
                                <LineChartOutlined className="text-5xl text-green-600 m-auto"/>
                                <p className="text-center text-gray-500">Biểu đồ sẽ được hiển thị ở đây, giúp theo dõi
                                    sự thay đổi số lượng hành khách theo từng tháng.</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card className="shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Biểu Đồ Tour Đặt Nhiều Nhất</h3>
                            {/* Placeholder for Chart Component */}
                            <div style={{height: '300px', backgroundColor: '#f0f0f0'}}>
                                <LineChartOutlined className="text-5xl text-green-600 m-auto"/>
                                <p className="text-center text-gray-500">Biểu đồ sẽ được hiển thị ở đây, giúp xác định
                                    các tour phổ biến nhất.</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </section>

            {/* Introduction Section */}
            <section className="text-center mb-10">
                <h1 className="text-6xl font-bold text-green-600 mb-4">Chào Mừng Đến Với Hà Giang Loop</h1>
                <p className="text-xl text-gray-600 mb-4">
                    Hà Giang là một trong những điểm đến du lịch nổi bật nhất tại Việt Nam, nổi tiếng với cảnh quan
                    thiên nhiên hùng vĩ,
                    văn hóa đa dạng và những cung đường đèo ngoạn mục.
                </p>
                <p className="text-xl text-gray-600 mb-4">
                    Chúng tôi cung cấp các tour du lịch chất lượng, giúp bạn khám phá vẻ đẹp tự nhiên và văn hóa độc đáo
                    của vùng đất này.
                </p>
                <p className="text-xl text-gray-600 mb-4">
                    Từ những cánh đồng hoa tam giác mạch đến những ngọn đồi xanh ngắt, hãy cùng chúng tôi trải nghiệm
                    hành trình đáng nhớ này!
                </p>
                <Button type="default" className="bg-gray-300 hover:bg-gray-400">
                    Tìm Hiểu Thêm
                </Button>
            </section>

            {/* Featured Attractions Section */}
            {/* Featured Attractions Section */}
            <section className="mb-10 bg-gray-100 p-8 rounded-lg shadow-lg">
                <h2 className="text-5xl font-semibold text-green-600 mb-4 text-center">Điểm Đến Nổi Bật</h2>
                <div className="flex justify-center space-x-8">
                    <div className="group relative w-1/3 bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-xl hover:bg-green-50">
                        <img alt="Cao nguyên đá Đồng Văn" className="h-[250px] w-full object-cover group-hover:opacity-80 transition duration-300" src="https://danviet.mediacdn.vn/296231569849192448/2022/11/13/3-16683281435741922708920-16683292175991033707260.jpeg" />
                        <div className="p-4">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition duration-300">Cao Nguyên Đá Đồng Văn</h3>
                            <p className="text-gray-600">Khám phá vẻ đẹp hoang sơ của cao nguyên đá, nơi lưu giữ nhiều giá trị văn hóa và thiên nhiên.</p>
                        </div>
                    </div>
                    <div className="group relative w-1/3 bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-xl hover:bg-green-50">
                        <img alt="Thung Lũng Sủng Là" className="h-[250px] w-full object-cover group-hover:opacity-80 transition duration-300" src="https://hagiangtre.vn/wp-content/uploads/2023/06/baner-youtube-1-1.jpg" />
                        <div className="p-4">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition duration-300">Thung Lũng Sủng Là</h3>
                            <p className="text-gray-600">Một thung lũng xinh đẹp với những cánh đồng xanh mướt và không khí trong lành.</p>
                        </div>
                    </div>
                    <div className="group relative w-1/3 bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-xl hover:bg-green-50">
                        <img alt="Chợ Phiên Đồng Văn" className="h-[250px] w-full object-cover group-hover:opacity-80 transition duration-300" src="https://hagiangamazingtour.vn/upload/images/cho-phien-dong-van-ha-giang/cho-phien-dong-van-ha-giang-13-.jpg" />
                        <div className="p-4">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition duration-300">Chợ Phiên Đồng Văn</h3>
                            <p className="text-gray-600">Nơi giao lưu văn hóa giữa các dân tộc thiểu số, chợ phiên đầy sắc màu và đặc sản.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Testimonials Section */}
            <section className="mb-10">
                <h2 className="text-5xl font-semibold text-green-600 mb-4 text-center">Khách Hàng Nói Gì</h2>
                <div className="flex justify-center space-x-8">
                    <div className="group relative w-1/3">
                        <Card
                            className="shadow-md transform transition duration-500   hover:shadow-xl hover:bg-green-50">
                            <h3 className="text-xl font-semibold mb-2">Nguyễn Văn A</h3>
                            <p className="text-gray-500">"Chuyến đi tuyệt vời! Tôi đã có những trải nghiệm không thể
                                quên và gặp gỡ nhiều người thú vị."</p>
                        </Card>
                    </div>
                    <div className="group relative w-1/3">
                        <Card
                            className="shadow-md transform transition duration-500   hover:shadow-xl hover:bg-green-50">
                            <h3 className="text-xl font-semibold mb-2">Trần Thị B</h3>
                            <p className="text-gray-500">"Dịch vụ rất chuyên nghiệp và tận tình. Tôi cảm thấy an tâm khi
                                tham gia tour."</p>
                        </Card>
                    </div>
                    <div className="group relative w-1/3">
                        <Card
                            className="shadow-md transform transition duration-500   hover:shadow-xl hover:bg-green-50">
                            <h3 className="text-xl font-semibold mb-2">Lê Văn C</h3>
                            <p className="text-gray-500">"Hà Giang thật sự là một nơi tuyệt đẹp! Tôi sẽ quay lại một lần
                                nữa."</p>
                        </Card>
                    </div>
                </div>
            </section>


            {/* Travel Tips Section */}
            <section className="mb-10 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-5xl font-semibold text-green-600 mb-6 text-center">Mẹo Du Lịch</h2>
                <ul className="text-lg text-gray-700 mb-4 space-y-4">
                    <li className="transition duration-500 hover:bg-green-50 p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-green-600 mr-4">1.</span>
                            <span>Luôn kiểm tra thời tiết và mang theo trang phục phù hợp với từng điều kiện khí hậu. Đừng để những cơn mưa bất chợt hay cái nắng cháy da làm phiền bạn!</span>
                        </div>
                    </li>
                    <li className="transition duration-500 hover:bg-green-50 p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-green-600 mr-4">2.</span>
                            <span>Đừng quên mang theo nước và đồ ăn nhẹ để bổ sung năng lượng trong suốt hành trình. Một vài món ăn vặt yêu thích sẽ giúp chuyến đi của bạn thú vị hơn nhiều đấy!</span>
                        </div>
                    </li>
                    <li className="transition duration-500 hover:bg-green-50 p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-green-600 mr-4">3.</span>
                            <span>Bảo vệ môi trường và tôn trọng văn hóa địa phương là trách nhiệm của mỗi du khách. Hãy để lại những dấu chân, không để lại những mảnh rác bạn nhé!</span>
                        </div>
                    </li>
                </ul>
            </section>


            {/* Local Cuisine Section */}
            <section className="mb-10 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-5xl font-semibold text-green-600 mb-4 text-center">Ẩm Thực Địa Phương</h2>
                <div className="flex justify-center space-x-8">
                    <div
                        className="group bg-gradient-to-r from-gray-100 to-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                        <img alt="Thắng Cố"
                             className="h-[250px] w-full object-cover group-hover:opacity-80 transition duration-300"
                             src="https://hagiangsensetravel.com/view/at_thang-co-cho-phien-dong-van_78a23af3400c0383960d03b52a4694d1.jpg"/>
                        <div className="p-4">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-800">Thắng Cố</h3>
                            <p className="text-gray-600">Món ăn truyền thống của người Mông, nổi bật với hương vị độc
                                đáo.</p>
                        </div>
                    </div>
                    <div
                        className="group bg-gradient-to-r from-gray-100 to-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                        <img alt="Bánh Tam Giác Mạch"
                             className="h-[250px] w-full object-cover group-hover:opacity-80 transition duration-300"
                             src="https://2trip.vn/wp-content/uploads/2023/01/banh-tam-giac-mach-ha-giang-19-e1674399621235.jpg"/>
                        <div className="p-4">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-800">Bánh Tam Giác Mạch</h3>
                            <p className="text-gray-600">Một loại bánh đặc sản được làm từ bột ngô và ăn kèm với
                                thịt.</p>
                        </div>
                    </div>
                    <div
                        className="group bg-gradient-to-r from-gray-100 to-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                        <img alt="Rượu Ngô"
                             className="h-[250px] w-full object-cover group-hover:opacity-80 transition duration-300"
                             src="https://dulichtoday.vn/wp-content/uploads/2022/09/ruou-ngo-ha-giang-15.jpg"/>
                        <div className="p-4">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-800">Rượu Ngô</h3>
                            <p className="text-gray-600">Loại rượu truyền thống, có hương vị đặc trưng và đậm đà.</p>
                        </div>
                    </div>
                </div>
            </section>

        </Content>
    );
};

export default HomePage;
