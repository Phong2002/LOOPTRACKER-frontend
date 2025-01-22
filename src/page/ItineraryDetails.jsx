import React, { useState } from "react";
import { Layout, Typography, Select, Card, Divider, Empty } from "antd";
import MapTrackerPreview from "./MapTrackerPreview";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const ItineraryDetails = ({ detailedItineraries = [] }) => {
    // Kiểm tra dữ liệu ban đầu, mặc định là null nếu không có
    const [selectedDay, setSelectedDay] = useState(detailedItineraries[0] || null);

    // Hàm xử lý khi chọn ngày
    const handleDayChange = (id) => {
        const selected = detailedItineraries.find((day) => day.id === id) || null;
        setSelectedDay(selected);
    };

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "20px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
                Chi Tiết Lịch Trình
            </Title>

            {/* Kiểm tra nếu không có dữ liệu */}
            {detailedItineraries.length === 0 ? (
                <Empty description="Không có dữ liệu lịch trình" />
            ) : (
                <>
                    {/* Chọn ngày */}
                    <Select
                        defaultValue={selectedDay?.id}
                        onChange={handleDayChange}
                        style={{ width: "100%", marginBottom: "20px" }}
                        size="large"
                    >
                        {detailedItineraries.map((day) => (
                            <Option key={day.id} value={day.id}>
                                Ngày {day.day}: {day.from} - {day.to}
                            </Option>
                        ))}
                    </Select>

                    {/* Thông tin chi tiết ngày */}
                    {selectedDay ? (
                        <Card
                            style={{
                                borderRadius: "10px",
                                marginBottom: "20px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                            bordered={false}
                        >
                            <Title level={4}>Ngày {selectedDay.day}</Title>
                            <p>
                                <Text strong>Từ:</Text> {selectedDay.from}
                            </p>
                            <p>
                                <Text strong>Đến:</Text> {selectedDay.to}
                            </p>
                            <Divider />
                            <p>{selectedDay.description}</p>
                        </Card>
                    ) : (
                        <Empty description="Không có chi tiết cho ngày đã chọn" />
                    )}

                    {/* Bản đồ với các waypoints */}
                    {selectedDay?.wayPoints?.length > 0 ? (
                        <Card
                            style={{
                                borderRadius: "10px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                            bordered={false}
                        >
                            <Title level={4}>Bản đồ lộ trình</Title>
                            <div style={{ height: "500px", borderRadius: "10px", overflow: "hidden" }}>
                                <MapTrackerPreview waypoints={selectedDay.wayPoints} />
                            </div>
                        </Card>
                    ) : (
                        <Empty description="Không có bản đồ lộ trình" />
                    )}
                </>
            )}
        </Layout>
    );
};

export default ItineraryDetails;
