import React from "react";
import { Card, List, Typography, Avatar, Divider, Space, Row, Col } from "antd";
import { UserOutlined, CarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ListPassengers = ({ tourAssignments = [] }) => {
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const host = import.meta.env.VITE_SERVER_HOST;
    const prefix = import.meta.env.VITE_SERVER_PREFIX;
    const baseURL = `${apiUrl}:${host}/${prefix}/file/image/download`;
    return (
        <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
                Danh Sách Hành Khách
            </Title>

            <Row gutter={[16, 16]}>
                {tourAssignments.map((assignment) => (
                    <Col xs={24} sm={24} md={12} lg={8} key={assignment.id}>
                        <Card
                            title={
                                <Space>
                                    <Avatar size="large" icon={<UserOutlined />} />
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>
                                            {assignment.passenger?.firstName || "Không rõ"}{" "}
                                            {assignment.passenger?.lastName || ""}
                                        </Title>
                                        <Text type="secondary">
                                            {assignment.passenger?.gender === "MALE"
                                                ? "Nam"
                                                : assignment.passenger?.gender === "FEMALE"
                                                ? "Nữ"
                                                : "Không rõ"}
                                        </Text>
                                    </div>
                                </Space>
                            }
                            bordered={false}
                            style={{
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                overflow: "hidden",
                            }}
                        >
                            <Divider orientation="left">Thông Tin Cá Nhân</Divider>
                            <p>
                                <Text strong>Email:</Text>{" "}
                                {assignment.passenger?.email || "Không có thông tin"}
                            </p>
                            <p>
                                <Text strong>Số điện thoại:</Text>{" "}
                                {assignment.passenger?.phoneNumber || "Không có thông tin"}
                            </p>
                            <p>
                                <Text strong>Ghi chú:</Text>{" "}
                                {assignment.passenger?.notes || "Không có ghi chú"}
                            </p>

                            <Divider orientation="left">Thông Tin Rider</Divider>
                            <p>
                                <Text strong>Tên tài xế:</Text>{" "}
                                {assignment.rider?.firstName || "Tự lái"}{" "}
                                {assignment.rider?.lastName || ""}
                            </p>
                            <p>
                                <Text strong>Biển số xe:</Text> {assignment.licensePlates || "Không rõ"}
                            </p>

                            <Divider orientation="left">Danh Sách Vật Dụng</Divider>
                            <List
                                itemLayout="horizontal"
                                dataSource={assignment.assignmentItems || []}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    shape="square"
                                                    src={`${baseURL}/${item.item.image}`}
                                                    // icon={!item.item?.image && <CarOutlined />}
                                                />
                                            }
                                            title={item.item?.name || "Không rõ"}
                                            description={`Số lượng: ${
                                                item.quantity || 0
                                            } | Trạng thái: ${item.status || "Không rõ"}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ListPassengers;
