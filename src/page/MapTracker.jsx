import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import apiService from '../service/ApiService';

const createDivIcon = (index, color) => {
  return L.divIcon({
    html: `<div style="background: ${color}; color: white; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; font-weight: bold; border: 2px solid white;">${index}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const createPersonIcon = (initials) => {
  return L.divIcon({
    html: `<div style="background: #1890ff; color: white; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; font-weight: bold; border: 2px solid white;">${initials}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const colors = {
  start: 'red',
  rest: 'blue',
  lunch: 'green',
  homestay: 'purple',
  default: 'gray',
};

function MapTracker({tourInstanceId }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const waypointMarkersRef = useRef(new Map());
  const personMarkersRef = useRef(new Map());
  const routingControlRef = useRef(null);
  const osrmServiceUrl = 'http://localhost:5000/route/v1';
  const [tourPackage,setTourPackage] = useState()
  const [waypoints,setWaypoints] = useState([]);

  const [persons, setPersons] = useState([]);
  const [zoom,setZoom] = useState(12);
  const [center,setCenter] = useState([22.828046498539656, 104.98396968789167]);

  const fetchListPersoonLocation = async () => {
    const data = await apiService.get("locations/persons/"+tourInstanceId);
    console.log("=================================fetchListPersoonLocation     ",data);
    setPersons(data)
    if(data?.[0]){
        setCenter([data?.[0].lat,data?.[0].lon])
        console.log("============================ ok ",[data?.[0].lat,data?.[0].lon])
    }

};

const getTourDetails = async () => {
    const param = { tourInstanceId: tourInstanceId };
    const data = await apiService.get("/tour-instance/details",param);
    console.log("=================================getTourPackage     ",data);
    setTourPackage(data?.tourPackage)
    setWaypoints(data.tourPackage?.detailedItineraries?.[0]?.wayPoints || [])
    console.log("====================1 ",data?.tourPackage?.detailedItinerarys?.[0]?.wayPoints || []);
};


useEffect(() => {
    fetchListPersoonLocation();
    getTourDetails();
}, []);

//   const waypoints = [
//     { id: "1", lon: 104.98396968789167, lat: 22.828046498539656, type: "start", description: "Start point", location: "Nguyen Trai, Ha Giang", index: 1 },
//     { id: "2", lon: 104.97807741165163, lat: 22.837044664462955, type: "rest", description: "Photo stop", location: "National Route 4C, Tam Son", index: 2 },
//     { id: "3", lon: 105.03508186287947, lat: 23.068088556024556, type: "lunch", description: "Lunch break", location: "National Route 4C, Cho Kem", index: 3 },
//     { id: "4", lon: 105.03747010217924, lat: 23.082949664381204, type: "rest", description: "Photo stop", location: "Can Ty Rest Area", index: 4 },
//     { id: "5", lon: 105.06548309116626, lat: 23.120157342127836, type: "rest", description: "", location: "Lao Va Chai", index: 5 },
//     { id: "6", lon: 105.14496230869555, lat: 23.116370209590396, type: "homestay", description: "", location: "Yen Minh", index: 6 },
//   ];

  const handleNewData = useCallback((data) => {
    setPersons(data);
  }, [setPersons]);

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 24,
    }).addTo(map);

    mapRef.current = map;
  }, [center, zoom]);

  // WebSocket logic to fetch persons
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe(`/topic/tracking-location/${tourInstanceId}`, (message) => {
          const body = JSON.parse(message.body);
          handleNewData(body);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [tourInstanceId, handleNewData]);

  // Update waypoints
  useEffect(() => {
    if (!mapRef.current) return;

    const currentWaypoints = new Set(waypoints.map((wp) => wp.index));
    const existingMarkers = new Set(waypointMarkersRef.current.keys());

    // Add or update markers
    waypoints.forEach((wp) => {
      const color = colors[wp.type] || colors.default;

      if (!waypointMarkersRef.current.has(wp.index)) {
        const marker = L.marker([wp.lat, wp.lon], { icon: createDivIcon(wp.index, color) }).addTo(mapRef.current);
        marker.bindPopup(`<strong>${wp.type}</strong><br/>${wp.description}<br/><em>${wp.location}</em>`);
        waypointMarkersRef.current.set(wp.index, marker);
      }
    });

    // Remove markers no longer in waypoints
    existingMarkers.forEach((index) => {
      if (!currentWaypoints.has(index)) {
        const marker = waypointMarkersRef.current.get(index);
        if (marker) {
          mapRef.current.removeLayer(marker);
          waypointMarkersRef.current.delete(index);
        }
      }
    });

    const latLngs = waypoints.map((wp) => L.latLng(wp.lat, wp.lon));
    if (latLngs.length > 1) {
      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints(latLngs);
      } else {
        routingControlRef.current = L.Routing.control({
          waypoints: latLngs,
          router: L.Routing.osrmv1({ serviceUrl: osrmServiceUrl }),
          routeWhileDragging: false,
          show: false,
          addWaypoints: false,
          createMarker: () => null,
        }).addTo(mapRef.current);
      }
    }
  }, [waypoints]);

  // Update persons' positions
  useEffect(() => {
    if (!mapRef.current) return;

    const animateMarker = (marker, fromLatLng, toLatLng, duration = 10000) => {
      const frames = 60;
      const interval = duration / frames;
      let progress = 0;

      const step = () => {
        progress += 1 / frames;

        if (progress >= 1) {
          marker.setLatLng(toLatLng);
          return;
        }

        const lat = fromLatLng.lat + (toLatLng.lat - fromLatLng.lat) * progress;
        const lng = fromLatLng.lng + (toLatLng.lng - fromLatLng.lng) * progress;
        marker.setLatLng([lat, lng]);

        setTimeout(step, interval);
      };

      step();
    };

    persons.forEach((person) => {
      const initials = person.fullName.split(' ').slice(-2).map((word) => word[0]).join('').toUpperCase();

      if (!personMarkersRef.current.has(person.id)) {
        const marker = L.marker([person.lat, person.lon], { icon: createPersonIcon(initials) }).addTo(mapRef.current);
        marker.bindPopup(`<strong>${person.fullName}</strong>`);
        personMarkersRef.current.set(person.id, marker);
      } else {
        const existingMarker = personMarkersRef.current.get(person.id);
        const fromLatLng = existingMarker.getLatLng();
        const toLatLng = L.latLng(person.lat, person.lon);

        if (!fromLatLng.equals(toLatLng)) {
          animateMarker(existingMarker, fromLatLng, toLatLng);
        }
      }
    });

    personMarkersRef.current.forEach((marker, id) => {
      if (!persons.some((person) => person.id === id)) {
        mapRef.current.removeLayer(marker);
        personMarkersRef.current.delete(id);
      }
    });
  }, [persons]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}></div>;
}

export default MapTracker;