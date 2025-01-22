import React, { useEffect, useState } from "react";
import { Card, List, Typography, Spin, Row, Col, Divider } from "antd";
import apiService from "../service/ApiService";

const { Title, Text } = Typography;

const EvidencePage = ({ tourInstanceId }) => {
    const apiUrl = import.meta.env.VITE_SERVER_URL;
    const host = import.meta.env.VITE_SERVER_HOST;
    const prefix = import.meta.env.VITE_SERVER_PREFIX;
    const baseURL = `${apiUrl}:${host}/${prefix}/file/image/download`;
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvidences = async () => {
        try {
            const data = await apiService.get(`/incident/tour/${tourInstanceId}`);
            setIncidents(data || []);
        } catch (error) {
            console.error("Failed to fetch incidents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tourInstanceId) {
            fetchEvidences();
        }
    }, [tourInstanceId]);

    if (loading) {
        return <Spin tip="Loading..." style={{ display: "block", margin: "50px auto" }} />;
    }

    return (
        <div style={{ margin: "20px" }}>
            <Title level={3}>Incident Evidence</Title>
            {incidents.length === 0 ? (
                <Text>No evidences available for this tour instance.</Text>
            ) : (
                <List
                    dataSource={incidents}
                    renderItem={(incident) => (
                        <Card
                            style={{ marginBottom: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                        >
                            <Row>
                                <Col span={18}>
                                    <Title level={4}>{incident.incidentType}</Title>
                                    <Text><strong>Description:</strong> {incident.description || "N/A"}</Text>
                                    <br />
                                    <Text><strong>Damage Cost:</strong> {incident.damageCost ? `${incident.damageCost.toLocaleString()} VND` : "N/A"}</Text>
                                    <br />
                                    <Text><strong>Date:</strong> {new Date(incident.incidentDate).toLocaleString()}</Text>
                                    <br />
                                    <Text><strong>Role Involved:</strong> {incident.involvedRole || "Unknown"}</Text>
                                </Col>
                                <Col span={6} style={{ textAlign: "right" }}>
                                    <Text><strong>Location:</strong></Text>
                                    <br />
                                    <Text>Lat: {incident.latitude || "N/A"}</Text>
                                    <br />
                                    <Text>Lon: {incident.longitude || "N/A"}</Text>
                                </Col>
                            </Row>
                            <Divider />
                            <Title level={5}>Evidences</Title>
                            <List
                                grid={{ gutter: 16, column: 3 }}
                                dataSource={incident.incidentEvidences}
                                renderItem={(evidence) => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            style={{ borderRadius: "8px", textAlign: "center" }}
                                            cover={
                                                <img
                                                    alt="evidence"
                                                
                                                    src={`${baseURL}/${evidence.evidenceUrl}`}
                                                    style={{ maxHeight: "300px", objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                                                />
                                            }
                                        >
                                            {`${baseURL}/${evidence.evidenceUrl}`}
                                            <Text>
                                                Uploaded: {new Date(evidence.uploadedAt).toLocaleString()}
                                            </Text>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    )}
                />
            )}
        </div>
    );
};

export default EvidencePage;