import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import { Modal, Radio, Button, Dropdown, Menu, Input, Form } from 'antd';

// Khôi phục icon mặc định của Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
});

const categories = [
    { value: 'rest', label: 'Điểm dừng chân', color: 'red' },
    { value: 'breakfast', label: 'Điểm ăn sáng', color: 'orange' },
    { value: 'lunch', label: 'Điểm ăn trưa', color: 'green' },
    { value: 'dinner', label: 'Điểm ăn tối', color: 'blue' },
    { value: 'homestay', label: 'Điểm dừng nghỉ homestay', color: 'purple' }
];

function MapPage() {
    const mapRef = useRef(null);
    const controlRef = useRef(null);
    const tempMarkerRef = useRef(null);

    const [waypoints, setWaypoints] = useState([]);
    const markersRef = useRef([]); // Lưu marker tương ứng với mỗi waypoint

    const [selectedPoint, setSelectedPoint] = useState(null);

    // Modal thêm mới waypoint
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Modal sửa vị trí waypoint
    const [editPositionModalVisible, setEditPositionModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editLat, setEditLat] = useState('');
    const [editLon, setEditLon] = useState('');

    // Modal cập nhật loại waypoint
    const [updateTypeModalVisible, setUpdateTypeModalVisible] = useState(false);
    const [updateTypeIndex, setUpdateTypeIndex] = useState(null);
    const [newCategory, setNewCategory] = useState(null);

    // Kéo để thay đổi độ cao danh sách
    const [listHeight, setListHeight] = useState(200);
    const isDraggingRef = useRef(false);
    const startYRef = useRef(null);
    const startHeightRef = useRef(null);

    useEffect(() => {
        const map = L.map('map', {
            center: [21.028511, 105.804817],
            zoom: 13
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 25
        }).addTo(map);

        const control = L.Routing.control({
            waypoints: [],
            showAlternatives: false,
            lineOptions: { styles: [{ color: 'blue', opacity: 0.6, weight: 5 }] },
            routeWhileDragging: false,
            addWaypoints: false,
            show: false,
            createMarker: () => null
        }).addTo(map);

        mapRef.current = map;
        controlRef.current = control;

        map.on('click', (e) => {
            const latlng = e.latlng;
            setSelectedPoint(latlng);

            // Xóa marker tạm thời cũ nếu có
            if (tempMarkerRef.current) {
                map.removeLayer(tempMarkerRef.current);
                tempMarkerRef.current = null;
            }

            // Tạo marker tạm thời
            const tempMarker = L.marker(latlng).addTo(map);
            tempMarkerRef.current = tempMarker;
        });

        const handleMouseMove = (e) => {
            if (isDraggingRef.current) {
                const diff = e.clientY - startYRef.current;
                const newHeight = startHeightRef.current - diff;
                if (newHeight > 50 && newHeight < window.innerHeight - 100) {
                    setListHeight(newHeight);
                }
            }
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            map.remove();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        // Cập nhật tuyến đường khi thay đổi waypoints
        if (controlRef.current) {
            const latLngs = waypoints.map((wp) => L.latLng(wp.lat, wp.lon));
            controlRef.current.setWaypoints(latLngs);
        }
    }, [waypoints]);

    const handleOpenModal = () => {
        if (!selectedPoint) return;
        setShowModal(true);
    };

    const handleConfirmWaypoint = () => {
        if (selectedPoint && mapRef.current && selectedCategory) {
            const map = mapRef.current;
            const newIndex = waypoints.length;

            // Xóa marker tạm thời
            if (tempMarkerRef.current) {
                map.removeLayer(tempMarkerRef.current);
                tempMarkerRef.current = null;
            }

            // Tìm color tương ứng
            const cat = categories.find(c => c.value === selectedCategory);
            const bgColor = cat ? cat.color : 'red';

            const divIcon = L.divIcon({
                html: `<div class="circle-marker" style="background:${bgColor};">${newIndex + 1}</div>`,
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const newMarker = L.marker(selectedPoint, { icon: divIcon }).addTo(map);

            // Thêm waypoint
            setWaypoints(prev => [...prev, {
                lat: selectedPoint.lat,
                lon: selectedPoint.lng,
                type: selectedCategory
            }]);

            // Lưu marker
            markersRef.current.push(newMarker);

            // Reset
            setSelectedPoint(null);
            setSelectedCategory(null);
            setShowModal(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedCategory(null);
        setShowModal(false);
    };

    const handleMouseDownOnHandle = (e) => {
        isDraggingRef.current = true;
        startYRef.current = e.clientY;
        startHeightRef.current = listHeight;
        e.preventDefault();
    };

    const handleClickWaypointItem = (wp) => {
        if (mapRef.current) {
            mapRef.current.setView([wp.lat, wp.lon], 15);
        }
    };

    // Xóa waypoint
    const deleteWaypoint = (index) => {
        setWaypoints(prev => {
            const newWps = [...prev];
            newWps.splice(index, 1);

            // Xóa marker khỏi map
            const marker = markersRef.current[index];
            if (marker && mapRef.current) {
                mapRef.current.removeLayer(marker);
            }

            // Xóa marker khỏi markersRef
            markersRef.current.splice(index, 1);

            // Cập nhật lại icon cho các marker sau khi xóa
            markersRef.current.forEach((m, i) => {
                const wp = newWps[i];
                const cat = categories.find(c => c.value === wp.type);
                const bgColor = cat ? cat.color : 'red';
                const newIcon = L.divIcon({
                    html: `<div class="circle-marker" style="background:${bgColor};">${i + 1}</div>`,
                    className: '',
                    iconSize: [30,30],
                    iconAnchor: [15,15]
                });
                m.setIcon(newIcon);
            });

            return newWps;
        });
    };

    // Sửa vị trí waypoint
    const startEditPosition = (index) => {
        const wp = waypoints[index];
        setEditIndex(index);
        setEditLat(wp.lat.toFixed(5));
        setEditLon(wp.lon.toFixed(5));
        setEditPositionModalVisible(true);
    };

    const handleSavePosition = () => {
        if (editIndex != null && !isNaN(parseFloat(editLat)) && !isNaN(parseFloat(editLon))) {
            const newLat = parseFloat(editLat);
            const newLon = parseFloat(editLon);

            setWaypoints(prev => {
                const newWps = [...prev];
                newWps[editIndex] = {
                    ...newWps[editIndex],
                    lat: newLat,
                    lon: newLon
                };

                // Cập nhật vị trí marker
                const marker = markersRef.current[editIndex];
                marker.setLatLng([newLat, newLon]);

                return newWps;
            });

            setEditPositionModalVisible(false);
            setEditIndex(null);
        }
    };

    const handleCancelPositionEdit = () => {
        setEditPositionModalVisible(false);
        setEditIndex(null);
    };

    // Cập nhật loại waypoint
    const startUpdateType = (index) => {
        setUpdateTypeIndex(index);
        setNewCategory(waypoints[index].type);
        setUpdateTypeModalVisible(true);
    };

    const handleUpdateType = () => {
        if (updateTypeIndex != null && newCategory) {
            setWaypoints(prev => {
                const newWps = [...prev];
                newWps[updateTypeIndex] = {
                    ...newWps[updateTypeIndex],
                    type: newCategory
                };

                // Cập nhật icon marker
                const marker = markersRef.current[updateTypeIndex];
                const wp = newWps[updateTypeIndex];
                const cat = categories.find(c => c.value === wp.type);
                const bgColor = cat ? cat.color : 'red';
                const newIcon = L.divIcon({
                    html: `<div class="circle-marker" style="background:${bgColor};">${updateTypeIndex + 1}</div>`,
                    className: '',
                    iconSize: [30,30],
                    iconAnchor: [15,15]
                });
                marker.setIcon(newIcon);

                return newWps;
            });

            setUpdateTypeModalVisible(false);
            setUpdateTypeIndex(null);
            setNewCategory(null);
        }
    };

    const handleCancelUpdateType = () => {
        setUpdateTypeModalVisible(false);
        setUpdateTypeIndex(null);
        setNewCategory(null);
    };

    // Menu cho mỗi waypoint (xóa, sửa vị trí, cập nhật loại)
    const getWaypointMenu = (index) => (
        <Menu>
            <Menu.Item key="1" onClick={() => startEditPosition(index)}>
                Sửa vị trí
            </Menu.Item>
            <Menu.Item key="2" onClick={() => startUpdateType(index)}>
                Cập nhật loại
            </Menu.Item>
            <Menu.Item key="3" danger onClick={() => deleteWaypoint(index)}>
                Xóa
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ height: "100vh", width: "100%", display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px' }}>
                {selectedPoint ? (
                    <div>Đã chọn vị trí: {selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}</div>
                ) : (
                    <div>Hãy click lên bản đồ để chọn vị trí</div>
                )}
                <Button type="primary" onClick={handleOpenModal} disabled={!selectedPoint}>
                    Thêm điểm dừng
                </Button>
            </div>

            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div id="map" style={{ flex: '1 1 auto' }}></div>

                <div
                    style={{
                        height: '5px',
                        background: '#ccc',
                        cursor: 'row-resize'
                    }}
                    onMouseDown={handleMouseDownOnHandle}
                ></div>

                <div
                    style={{
                        height: `${listHeight}px`,
                        overflowY: 'auto',
                        background: '#f0f2f5',
                        padding: '10px'
                    }}
                >
                    <h3>Danh sách các điểm dừng</h3>
                    <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
                        {waypoints.length === 0 && <div>Chưa có điểm dừng nào.</div>}
                        {waypoints.map((wp, index) => {
                            const cat = categories.find(c => c.value === wp.type);
                            return (
                                <div
                                    key={index}
                                    style={{
                                        background: '#fff',
                                        marginBottom: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        padding: '8px',
                                        position: 'relative'
                                    }}
                                >
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleClickWaypointItem(wp)}
                                    >
                                        <strong>#{index + 1}</strong>: {cat ? cat.label : wp.type}<br />
                                        Lat: {wp.lat.toFixed(5)}, Lon: {wp.lon.toFixed(5)}
                                    </div>
                                    <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                                        <Dropdown overlay={getWaypointMenu(index)} trigger={['click']}>
                                            <Button>...</Button>
                                        </Dropdown>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal thêm điểm dừng */}
            <Modal
                title="Chọn loại điểm dừng"
                visible={showModal}
                onOk={handleConfirmWaypoint}
                onCancel={handleCloseModal}
                okButtonProps={{ disabled: !selectedCategory }}
            >
                <Radio.Group onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                    {categories.map(cat => (
                        <Radio key={cat.value} value={cat.value}>
                            {cat.label}
                        </Radio>
                    ))}
                </Radio.Group>
            </Modal>

            {/* Modal sửa vị trí */}
            <Modal
                title="Sửa vị trí"
                visible={editPositionModalVisible}
                onOk={handleSavePosition}
                onCancel={handleCancelPositionEdit}
            >
                <Form layout="vertical">
                    <Form.Item label="Vĩ độ (lat)">
                        <Input value={editLat} onChange={(e) => setEditLat(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Kinh độ (lon)">
                        <Input value={editLon} onChange={(e) => setEditLon(e.target.value)} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal cập nhật loại */}
            <Modal
                title="Cập nhật loại điểm dừng"
                visible={updateTypeModalVisible}
                onOk={handleUpdateType}
                onCancel={handleCancelUpdateType}
                okButtonProps={{ disabled: !newCategory }}
            >
                <Radio.Group onChange={(e) => setNewCategory(e.target.value)} value={newCategory}>
                    {categories.map(cat => (
                        <Radio key={cat.value} value={cat.value}>
                            {cat.label}
                        </Radio>
                    ))}
                </Radio.Group>
            </Modal>

            <style>{`
        .circle-marker {
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-weight: bold;
          border: 2px solid white;
        }
      `}</style>
        </div>
    );
}

export default MapPage;
