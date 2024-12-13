import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { Modal, Select, Input, Button, Dropdown, Menu } from 'antd';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
});

const { Option } = Select;

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
    const tempEditMarkerRef = useRef(null);

    const [waypoints, setWaypoints] = useState([]);
    const markersRef = useRef([]);

    const [selectedPoint, setSelectedPoint] = useState(null);

    // Modal thêm waypoint
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [description, setDescription] = useState('');

    const [isEditingPosition, setIsEditingPosition] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editNewPoint, setEditNewPoint] = useState(null);

    // Modal chỉnh sửa waypoint
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [editDescription, setEditDescription] = useState('');

    const [listHeight, setListHeight] = useState(200);
    const isDraggingRef = useRef(false);
    const startYRef = useRef(null);
    const startHeightRef = useRef(null);

    // Ref để luôn có giá trị mới nhất của isEditingPosition trong callback
    const isEditingPositionRef = useRef(isEditingPosition);
    useEffect(() => {
        isEditingPositionRef.current = isEditingPosition;
    }, [isEditingPosition]);

    useEffect(() => {
        const map = L.map('map', {
            center: [21.028511, 105.804817],
            zoom: 13
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
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

            if (!isEditingPositionRef.current) {
                setSelectedPoint(latlng);
                if (tempMarkerRef.current) {
                    map.removeLayer(tempMarkerRef.current);
                    tempMarkerRef.current = null;
                }
                const tempMarker = L.marker(latlng).addTo(map);
                tempMarkerRef.current = tempMarker;
            } else {
                setEditNewPoint(latlng);
                if (tempEditMarkerRef.current) {
                    map.removeLayer(tempEditMarkerRef.current);
                    tempEditMarkerRef.current = null;
                }
                const tempMarker = L.marker(latlng).addTo(map);
                tempEditMarkerRef.current = tempMarker;
            }
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
        if (controlRef.current) {
            const latLngs = waypoints.map((wp) => L.latLng(wp.lat, wp.lon));
            controlRef.current.setWaypoints(latLngs);
        }
    }, [waypoints]);

    const handleOpenModal = () => {
        if (!selectedPoint || isEditingPosition) return;
        setShowModal(true);
    };

    const handleConfirmWaypoint = () => {
        if (selectedPoint && mapRef.current && selectedCategory) {
            const map = mapRef.current;
            const newIndex = waypoints.length;

            if (tempMarkerRef.current) {
                map.removeLayer(tempMarkerRef.current);
                tempMarkerRef.current = null;
            }

            const cat = categories.find(c => c.value === selectedCategory);
            const bgColor = cat ? cat.color : 'red';

            const divIcon = L.divIcon({
                html: `<div class="circle-marker" style="background:${bgColor};">${newIndex + 1}</div>`,
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const newMarker = L.marker(selectedPoint, { icon: divIcon }).addTo(map);
            newMarker.bindPopup(`<strong>${cat ? cat.label : selectedCategory}</strong><br/>${description}`);

            setWaypoints(prev => [...prev, {
                lat: selectedPoint.lat,
                lon: selectedPoint.lng,
                type: selectedCategory,
                description: description
            }]);

            markersRef.current.push(newMarker);

            setSelectedPoint(null);
            setSelectedCategory(null);
            setDescription('');
            setShowModal(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedCategory(null);
        setDescription('');
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

    const deleteWaypoint = (index) => {
        setWaypoints(prev => {
            const newWps = [...prev];
            newWps.splice(index, 1);

            const marker = markersRef.current[index];
            if (marker && mapRef.current) {
                mapRef.current.removeLayer(marker);
            }

            markersRef.current.splice(index, 1);

            markersRef.current.forEach((m, i) => {
                const wp = newWps[i];
                const cat = categories.find(c => c.value === wp.type);
                const bgColor = cat ? cat.color : 'red';
                const newIcon = L.divIcon({
                    html: `<div class="circle-marker" style="background:${bgColor};">${i + 1}</div>`,
                    className: '',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                m.setIcon(newIcon);
            });

            return newWps;
        });
    };

    const startEditPosition = (index) => {
        if (isEditingPosition) return;
        setIsEditingPosition(true);
        setEditIndex(index);
        setEditNewPoint(null);
    };

    const cancelEditPosition = () => {
        setIsEditingPosition(false);
        setEditIndex(null);
        setEditNewPoint(null);
        if (tempEditMarkerRef.current && mapRef.current) {
            mapRef.current.removeLayer(tempEditMarkerRef.current);
            tempEditMarkerRef.current = null;
        }
    };

    const confirmEditPosition = () => {
        if (editIndex != null && editNewPoint && mapRef.current) {
            const newLat = editNewPoint.lat;
            const newLon = editNewPoint.lng;

            setWaypoints(prev => {
                const newWps = [...prev];
                newWps[editIndex] = {
                    ...newWps[editIndex],
                    lat: newLat,
                    lon: newLon
                };

                const marker = markersRef.current[editIndex];
                marker.setLatLng([newLat, newLon]);

                return newWps;
            });

            if (tempEditMarkerRef.current) {
                mapRef.current.removeLayer(tempEditMarkerRef.current);
                tempEditMarkerRef.current = null;
            }

            setIsEditingPosition(false);
            setEditIndex(null);
            setEditNewPoint(null);
        }
    };

    const startEditWaypoint = (index) => {
        const wp = waypoints[index];
        setEditIndex(index);
        setEditCategory(wp.type);
        setEditDescription(wp.description);
        setEditModalVisible(true);
    };

    const handleConfirmEditWaypoint = () => {
        if (editIndex != null && editCategory && editDescription) {
            setWaypoints(prev => {
                const newWps = [...prev];
                newWps[editIndex] = {
                    ...newWps[editIndex],
                    type: editCategory,
                    description: editDescription
                };

                const marker = markersRef.current[editIndex];
                const wp = newWps[editIndex];
                const cat = categories.find(c => c.value === wp.type);
                const bgColor = cat ? cat.color : 'red';
                const newIcon = L.divIcon({
                    html: `<div class="circle-marker" style="background:${bgColor};">${editIndex + 1}</div>`,
                    className: '',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                marker.setIcon(newIcon);
                marker.bindPopup(`<strong>${cat ? cat.label : wp.type}</strong><br/>${wp.description}`);

                return newWps;
            });

            setEditModalVisible(false);
            setEditIndex(null);
            setEditCategory(null);
            setEditDescription('');
        }
    };

    const handleCancelEditWaypoint = () => {
        setEditModalVisible(false);
        setEditIndex(null);
        setEditCategory(null);
        setEditDescription('');
    };

    const getWaypointMenu = (index) => (
        <Menu>
            <Menu.Item key="1" onClick={() => startEditPosition(index)}>
                Sửa vị trí
            </Menu.Item>
            <Menu.Item key="2" onClick={() => startEditWaypoint(index)}>
                Chỉnh sửa điểm dừng
            </Menu.Item>
            <Menu.Item key="3" danger onClick={() => deleteWaypoint(index)}>
                Xóa
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ height: "100vh", width: "100%", display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px' }}>
                {selectedPoint && !isEditingPosition ? (
                    <div>Đã chọn vị trí: {selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}</div>
                ) : (
                    <div>{isEditingPosition ? "Đang sửa vị trí: Hãy click lên bản đồ để chọn vị trí mới" : "Hãy click lên bản đồ để chọn vị trí"}</div>
                )}
                {!isEditingPosition && (
                    <Button type="primary" onClick={handleOpenModal} disabled={!selectedPoint}>
                        Thêm điểm dừng
                    </Button>
                )}
                {isEditingPosition && (
                    <>
                        <Button type="primary" onClick={confirmEditPosition} disabled={!editNewPoint} style={{ marginRight: 8 }}>
                            Cập nhật vị trí
                        </Button>
                        <Button onClick={cancelEditPosition}>
                            Hủy
                        </Button>
                    </>
                )}
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
                                        Mô tả: {wp.description}<br />
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
                title="Thêm điểm dừng"
                visible={showModal}
                onOk={handleConfirmWaypoint}
                onCancel={handleCloseModal}
                okButtonProps={{ disabled: !selectedCategory || !description }}
            >
                <Select
                    placeholder="Chọn loại điểm dừng"
                    value={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {categories.map(cat => (
                        <Option key={cat.value} value={cat.value}>
                            {cat.label}
                        </Option>
                    ))}
                </Select>
                <Input
                    placeholder="Nhập mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Modal>

            {/* Modal chỉnh sửa waypoint */}
            <Modal
                title="Chỉnh sửa điểm dừng"
                visible={editModalVisible}
                onOk={handleConfirmEditWaypoint}
                onCancel={handleCancelEditWaypoint}
                okButtonProps={{ disabled: !editCategory || !editDescription }}
            >
                <Select
                    placeholder="Chọn loại điểm dừng"
                    value={editCategory}
                    onChange={(value) => setEditCategory(value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {categories.map(cat => (
                        <Option key={cat.value} value={cat.value}>
                            {cat.label}
                        </Option>
                    ))}
                </Select>
                <Input
                    placeholder="Nhập mô tả"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                />
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
