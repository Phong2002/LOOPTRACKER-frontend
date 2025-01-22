import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

// Tạo icon cho waypoints
const createDivIcon = (index, color) => {
  return L.divIcon({
    html: `<div style="background: ${color}; color: white; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; font-weight: bold; border: 2px solid white;">${index}</div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const colors = {
  start: "red",
  rest: "blue",
  lunch: "green",
  homestay: "purple",
  default: "gray",
};

const MapTrackerPreview = ({ waypoints = [] }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const waypointMarkersRef = useRef(new Map());
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    // Khởi tạo bản đồ
    const map = L.map(mapContainerRef.current, {
      center: [22.828046498539656, 104.98396968789167], // Tọa độ mặc định
      zoom: 12,
    });

    // Thêm tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 24,
    }).addTo(map);

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current || waypoints.length === 0) return;

    // Clear waypoint markers nếu đã có
    waypointMarkersRef.current.forEach((marker) => {
      mapRef.current.removeLayer(marker);
    });
    waypointMarkersRef.current.clear();

    // Sắp xếp waypoints theo `index` từ bé đến lớn
    const sortedWaypoints = [...waypoints].sort((a, b) => a.index - b.index);

    // Thêm các waypoint mới
    const latLngs = sortedWaypoints.map((wp) => {
      const color = colors[wp.type] || colors.default;
      const marker = L.marker([parseFloat(wp.lat), parseFloat(wp.lon)], {
        icon: createDivIcon(wp.index, color),
      })
        .addTo(mapRef.current)
        .bindPopup(
          `<strong>${wp.type || "Waypoint"}</strong><br/>${wp.description || ""}<br/><em>${wp.location || ""}</em>`
        );

      waypointMarkersRef.current.set(wp.index, marker);

      return L.latLng(parseFloat(wp.lat), parseFloat(wp.lon));
    });

    // Điều chỉnh bản đồ focus vào các waypoint
    const bounds = L.latLngBounds(latLngs);
    mapRef.current.fitBounds(bounds, { padding: [20, 20] });

    // Hiển thị tuyến đường giữa các waypoint
    if (latLngs.length > 1) {
      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints(latLngs);
      } else {
        routingControlRef.current = L.Routing.control({
          waypoints: latLngs,
          router: L.Routing.osrmv1(),
          routeWhileDragging: false,
          show: false,
          addWaypoints: false,
          createMarker: () => null, // Ẩn marker mặc định
        }).addTo(mapRef.current);
      }
    }
  }, [waypoints]);

  return <div ref={mapContainerRef} style={{ height: "500px", width: "100%" }} />;
};

export default MapTrackerPreview;
