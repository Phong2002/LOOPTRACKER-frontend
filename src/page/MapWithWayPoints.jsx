// MapWithWaypoints.js
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import {Select, message, Spin, Dropdown, Button, Modal, Input, Menu} from 'antd';

const { Option } = Select;

// Define waypoint categories
const categories = [
    { value: 'start', label: 'Điểm xuất phát', color: 'red' },
    { value: 'rest', label: 'Điểm dừng chân', color: 'red' },
    { value: 'breakfast', label: 'Điểm ăn sáng', color: 'orange' },
    { value: 'lunch', label: 'Điểm ăn trưa', color: 'green' },
    { value: 'dinner', label: 'Điểm ăn tối', color: 'blue' },
    { value: 'homestay', label: 'Điểm dừng nghỉ homestay', color: 'purple' },
    { value: 'end', label: 'Điểm kết thúc,trả khách', color: 'purple' }
];

// Define custom drop icon
const dropIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // URL của icon
    iconSize: [30, 30], // Kích thước icon
    iconAnchor: [15, 30], // Vị trí neo icon
    popupAnchor: [0, -30] // Vị trí popup
});

function MapWithWaypoints({
                              initialWaypoints = [],
                              onWaypointsChange,
                              osrmServiceUrl = 'http://localhost:5000/route/v1',
                              profile = 'bike',
                              language = 'vi',
                              reverseGeocodingUrl = 'https://nominatim.openstreetmap.org/reverse' // URL của dịch vụ reverse geocoding
                          }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const controlRef = useRef(null);
    const markersRef = useRef([]);
    const tempMarkerRef = useRef(null);

    const [waypoints, setWaypoints] = useState(initialWaypoints);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [selectedLocationName, setSelectedLocationName] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [description, setDescription] = useState('');

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [editDescription, setEditDescription] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    const [listHeight, setListHeight] = useState(200);
    const isDraggingRef = useRef(false);
    const startYRef = useRef(null);
    const startHeightRef = useRef(null);

    const [isFetchingName, setIsFetchingName] = useState(false); // State để quản lý loading


    useEffect(() => {
        setWaypoints(initialWaypoints);
    }, [initialWaypoints]);

    // Update routing and markers when waypoints change
    useEffect(() => {
        if (controlRef.current) {
            const latLngs = waypoints.map((wp) => L.latLng(wp.lat, wp.lon));
            controlRef.current.setWaypoints(latLngs);
        }
        if (onWaypointsChange) {
            onWaypointsChange(waypoints);
        }
    }, [waypoints, onWaypointsChange]);

    // Initialize map
    useEffect(() => {
        if (mapRef.current) return; // Ngăn chặn khởi tạo nhiều lần

        const map = L.map(mapContainerRef.current, {
            center: [21.028511, 105.804817], // Trung tâm mặc định (Hà Nội, Việt Nam)
            zoom: 14
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20
        }).addTo(map);

        // Add GeoSearch Control
        const provider = new OpenStreetMapProvider({
            params: {
                language: language,
            },
        });        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'bar',
            showMarker: false,
            showPopup: false,
            retainZoomLevel: false,
            animateZoom: true,
            autoClose: true,
            keepResult: false,
            searchLabel: 'Nhập địa chỉ hoặc tên địa điểm...',
            zoomLevel: 18
        });

        map.addControl(searchControl);

        // Handle search result
        map.on('geosearch/showlocation', function (result) {
            const { x: lon, y: lat } = result.location;
            const selectedLatLng = L.latLng(lat, lon);
            map.setView(selectedLatLng, 18);
        });

        // Initialize Routing Control với OSRM
        const control = L.Routing.control({
            waypoints: [],
            router: L.Routing.osrmv1({
                serviceUrl: osrmServiceUrl, // URL server OSRM
                profile: profile, // 'car', 'bike', v.v.
                language: language
            }),
            routeWhileDragging: false,
            addWaypoints: false,
            show: false,
            createMarker: () => null
        }).addTo(map);

        mapRef.current = map;
        controlRef.current = control;

        // Handle map click để chọn điểm
        const handleMapClick = (e) => {
            const latlng = e.latlng;
            setSelectedPoint(latlng);

            // Loại bỏ marker tạm trước đó nếu có
            if (tempMarkerRef.current) {
                mapRef.current.removeLayer(tempMarkerRef.current);
            }

            // Thêm marker tạm tại vị trí đã chọn
            const tempMarker = L.marker(latlng, { icon: dropIcon }).addTo(mapRef.current);
            tempMarkerRef.current = tempMarker;

            setSelectedLocationName(''); // Reset tên vị trí
        };

        map.on('click', handleMapClick);

        // Handle resize
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
            if (mapRef.current) {
                mapRef.current.off('geosearch/showlocation');
                mapRef.current.off('click', handleMapClick);
                mapRef.current.remove();
                mapRef.current = null;
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [osrmServiceUrl, profile, language, reverseGeocodingUrl]);

    // Cập nhật routing khi waypoints thay đổi
    useEffect(() => {
        if (controlRef.current) {
            const latLngs = waypoints.map((wp) => L.latLng(wp.lat, wp.lon));
            controlRef.current.setWaypoints(latLngs);
        }
        if (onWaypointsChange) {
            onWaypointsChange(waypoints);
        }
    }, [waypoints, onWaypointsChange]);

    // Cập nhật markers khi waypoints thay đổi
    useEffect(() => {
        if (!mapRef.current) return;

        // Loại bỏ các marker hiện tại
        markersRef.current.forEach(marker => {
            mapRef.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Thêm các marker mới
        waypoints.forEach((wp, index) => {
            const cat = categories.find(c => c.value === wp.type);
            const bgColor = cat ? cat.color : 'red';

            const divIcon = L.divIcon({
                html: `<div class="circle-marker" style="background:${bgColor};">${index + 1}</div>`,
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([wp.lat, wp.lon], { icon: divIcon, draggable: true }).addTo(mapRef.current);
            marker.bindPopup(`<strong>${cat ? cat.label : wp.type}</strong><br/>${wp.description}<br/><em>${wp.location}</em>`);
            markersRef.current.push(marker);

            // Handle marker drag end để cập nhật vị trí waypoint
            marker.on('dragend', (e) => {
                const newLatLng = e.target.getLatLng();
                setWaypoints(prev => {
                    const newWps = [...prev];
                    newWps[index] = {
                        ...newWps[index],
                        lat: newLatLng.lat,
                        lon: newLatLng.lng
                    };
                    return newWps;
                });
            });
        });
    }, [waypoints]);

    // Hàm fetch tên vị trí (reverse geocoding)
    const fetchLocationName = async (lat, lon) => {
        setIsFetchingName(true);
        try {
            const response = await fetch(`${reverseGeocodingUrl}?format=jsonv2&lat=${lat}&lon=${lon}`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'MapWithWaypointsApp/1.0 ' 
                }
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
                }
                throw new Error('Không thể lấy tên vị trí.');
            }

            const data = await response.json();
            const location = data.display_name || 'Không xác định';
            return location;
        } catch (error) {
            console.error(error);
            message.error(error.message || 'Không thể lấy tên vị trí.');
            return 'Không xác định';
        } finally {
            setIsFetchingName(false);
        }
    };

    // Mở modal thêm waypoint và fetch tên vị trí
    const openAddWaypointModal = async () => {
        if (!selectedPoint) {
            message.warning('Vui lòng nhấp vào bản đồ để chọn vị trí trước khi thêm điểm dừng.');
            return;
        }

        setIsFetchingName(true);

        // Fetch tên vị trí
        const location = await fetchLocationName(selectedPoint.lat, selectedPoint.lng);

        setSelectedLocationName(location);
        setIsFetchingName(false);
        setShowAddModal(true);
    };

    // Xác nhận thêm waypoint
    const handleConfirmWaypoint = () => {
        if (selectedPoint && selectedCategory && description) {
            setWaypoints(prev => [...prev, {
                lat: selectedPoint.lat,
                lon: selectedPoint.lng,
                type: selectedCategory,
                description: description,
                location: selectedLocationName
            }]);

            message.success('Thêm điểm dừng thành công.');

            // Loại bỏ marker tạm
            if (tempMarkerRef.current) {
                mapRef.current.removeLayer(tempMarkerRef.current);
                tempMarkerRef.current = null;
            }

            // Reset states
            setSelectedPoint(null);
            setSelectedLocationName('');
            setSelectedCategory(null);
            setDescription('');
            setShowAddModal(false);
        } else {
            message.error('Vui lòng chọn loại điểm dừng và nhập mô tả.');
        }
    };

    // Đóng modal thêm waypoint
    const handleCloseAddModal = () => {
        // Loại bỏ marker tạm nếu có
        if (tempMarkerRef.current) {
            mapRef.current.removeLayer(tempMarkerRef.current);
            tempMarkerRef.current = null;
        }
        setSelectedPoint(null);
        setSelectedLocationName('');
        setSelectedCategory(null);
        setDescription('');
        setShowAddModal(false);
    };

    // Xử lý khi click vào waypoint trong danh sách
    const handleClickWaypointItem = (wp) => {
        if (mapRef.current) {
            mapRef.current.setView([wp.lat, wp.lon], 15);
        }
    };

    // Xóa một waypoint
    const deleteWaypoint = (index) => {
        setWaypoints(prev => {
            const newWps = [...prev];
            newWps.splice(index, 1);
            return newWps;
        });
    };

    // Mở modal chỉnh sửa waypoint
    const openEditModal = (index) => {
        const wp = waypoints[index];
        setEditIndex(index);
        setEditCategory(wp.type);
        setEditDescription(wp.description);
        setEditModalVisible(true);
    };

    // Xác nhận chỉnh sửa waypoint
    const handleConfirmEditWaypoint = () => {
        if (editIndex != null && editCategory && editDescription) {
            setWaypoints(prev => {
                const newWps = [...prev];
                newWps[editIndex] = {
                    ...newWps[editIndex],
                    type: editCategory,
                    description: editDescription
                    // Có thể cho phép chỉnh sửa tên ở đây
                };
                return newWps;
            });

            message.success('Chỉnh sửa waypoint thành công.');

            // Reset states
            setEditModalVisible(false);
            setEditIndex(null);
            setEditCategory(null);
            setEditDescription('');
        } else {
            message.error('Vui lòng chọn loại điểm dừng và nhập mô tả.');
        }
    };

    // Hủy chỉnh sửa waypoint
    const handleCancelEditWaypoint = () => {
        setEditModalVisible(false);
        setEditIndex(null);
        setEditCategory(null);
        setEditDescription('');
    };

    // Tạo menu cho mỗi waypoint
    const getWaypointMenu = (index) => (
        <Menu>
            <Menu.Item key="1" onClick={() => openEditModal(index)}>
                Chỉnh sửa điểm dừng
            </Menu.Item>
            <Menu.Item key="2" danger onClick={() => deleteWaypoint(index)}>
                Xóa
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ height: "100%", width: "100%", display: 'flex', flexDirection: 'column' }}>
            {/* Top Control Panel */}
            <div style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <Button type="primary" onClick={openAddWaypointModal} disabled={!selectedPoint || isFetchingName}>
                    {isFetchingName ? <Spin size="small" /> : 'Thêm điểm dừng'}
                </Button>
            </div>

            {/* Map và Waypoint List */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* Map */}
                <div ref={mapContainerRef} style={{ flex: '1 1 auto' }}></div>

                {/* Resize Handle */}
                <div
                    style={{
                        height: '5px',
                        background: '#ccc',
                        cursor: 'row-resize'
                    }}
                    onMouseDown={(e) => {
                        isDraggingRef.current = true;
                        startYRef.current = e.clientY;
                        startHeightRef.current = listHeight;
                        e.preventDefault();
                    }}
                ></div>

                {/* Waypoint List */}
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
                                        Vị trí: {wp.location}<br />
                                        Vĩ độ: {Number(wp.lat).toFixed(5)}, Kinh độ: {Number(wp.lon).toFixed(5)}
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

            {/* Add Waypoint Modal */}
            <Modal
                title="Thêm điểm dừng"
                visible={showAddModal}
                onOk={handleConfirmWaypoint}
                onCancel={handleCloseAddModal}
                okButtonProps={{ disabled: !selectedCategory || !description }}
            >
                <p>Tọa độ: Vĩ độ {selectedPoint ? selectedPoint.lat.toFixed(5) : ''},
                    Kinh độ {selectedPoint ? selectedPoint.lng.toFixed(5) : ''}</p>
                <p>Vị trí: {selectedLocationName || 'Không xác định'}</p>
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

            {/* Edit Waypoint Modal */}
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

            {/* Custom CSS */}
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

export default MapWithWaypoints;
