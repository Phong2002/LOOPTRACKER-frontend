import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import MapTracker from "./MapTracker";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate, useParams } from "react-router-dom";
import { BackwardFilled, LeftOutlined, SearchOutlined } from "@ant-design/icons";
import TravelDetails from "./TravelDetails";

function TrackTravelPage() {
    // const [tourInstanceId,setTourInstanceId] = useState("34")
    const [currentScreen, setCurrentScreen] = useState("routeTracking"); // Quản lý màn hình hiển thị
    const { tourInstanceId } = useParams();
    const navigate = useNavigate(); // Hook để điều hướng

    // const [listUserLocation, setListUserLocation] = useState([]);

    // useEffect(() => {
    //   const stompClient = new Client({
    //     brokerURL: "ws://localhost:8080/ws", // Địa chỉ WebSocket server
    //     connectHeaders: {
    //       // Các headers nếu cần
    //     },
    //     webSocketFactory: () => new SockJS("http://localhost:8080/ws"), // Sử dụng SockJS
    //     debug: function (str) {
    //       console.log(str);
    //     },
    //     onConnect: () => {
    //       console.log("Connected to WebSocket");
  
    //       // Đăng ký nhận dữ liệu từ topic
    //       stompClient.subscribe(`/topic/tracking-location/${tourInstanceId}`, (message) => {
    //         const body = JSON.parse(message.body);
    //         console.log("=======================body=============="+message.body);
            
    //         setListUserLocation(body);
    //       });
    //     },
    //     onDisconnect: () => {
    //       console.log("Disconnected from WebSocket");
    //     },
    //   });
  
    //   // Kết nối WebSocket
    //   stompClient.activate();
  
    //   // Dọn dẹp kết nối khi component unmount
    //   return () => {
    //     stompClient.deactivate();
    //   };
    // }, [tourInstanceId]);



    return (
        <div className="h-[100vh] flex flex-col">
            <div>
            <div className="mt-1">
                <Button
                    onClick={() => navigate("/track-travel")}
                    style={{
                        borderRadius: "5px",
                    }}

                    type="primary" icon={<LeftOutlined />} iconPosition="start"
                >
                    Quay lại
                </Button>
            </div>
            </div>
            <div className="flex justify-center p-4">
                {/* Nút chuyển đổi màn hình */}
                <Space>
                    <Button
                        type={currentScreen === "routeTracking" ? "primary" : "default"}
                        onClick={() => setCurrentScreen("routeTracking")}
                    >
                        Theo dõi lộ trình
                    </Button>
                    <Button
                        type={currentScreen === "tripInfo" ? "primary" : "default"}
                        onClick={() => setCurrentScreen("tripInfo")}
                    >
                        Thông tin chuyến đi
                    </Button>
                </Space>
            </div>
            <div className="flex-1">
                {currentScreen === "routeTracking" && (
                    <div className="h-full">
                        <MapTracker tourInstanceId={tourInstanceId}  />
                    </div>
                )}
                {currentScreen === "tripInfo" && (
                    <div>
                        <TravelDetails tourInstanceId={tourInstanceId}/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrackTravelPage;
