import React, { useState, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
  GeoJSON,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MainMap.css';
import { fetchGreenPathsPathsAndSegments } from '../../api/api';
import MainSideBar from '../MainSideBar/MainSideBar';

function MyMap() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupLocation, setPopupLocation] = useState([51.505, -0.09]); // Default location

  const [highlightedMarkers, setHighlightedMarkers] = useState([]); // State for markers

  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [key, setKey] = useState(0);

  const [transportMode, setTransportMode] = useState('walking');
  const [exposureType, setExposureType] = useState('greenery');
  const [city] = useState('helsinki');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar open/close

  const markerRef = useRef(null);

  const mapRef = useRef();
  const sidebarRef = useRef();

  const helsinkiCenter = [60.1959, 24.9384];

  // const boundingBox = [
  //   [60.4, 24.6], // Top left corner
  //   [60.4, 25.3], // Top right corner
  //   [60.0, 25.3], // Bottom right corner
  //   [60.0, 24.6], // Bottom left corner
  // ];

  const helsinkiBorder = [
    [60.2971, 24.9111],
    [60.2946, 24.8252],
    [60.262, 24.8154],
    [60.215, 24.8501],
    [60.1872, 24.9276],
    [60.1801, 24.9635],
    [60.1627, 25.0225],
    [60.168, 25.0692],
    [60.1982, 25.1154],
    [60.2364, 25.0787],
    [60.2682, 25.0201],
    [60.2971, 24.9111],
  ];

  // allowed bounds
  const bounds = L.latLngBounds(helsinkiBorder);

  // const getColor = (value) => {
  //     if (value < 15) return '#000';
  //     if (value < 25) return 'orange';
  //     return 'green';
  // };

  // const getWeight = (id) => {
  //     return highlightedSegments.includes(id) ? 5 : 2;  // Thicker line for highlighted segments
  //   };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (bounds.contains(e.latlng)) {
          setPopupLocation(e.latlng);
          setClickedLocation(e.latlng); // Close the popup
          setPopupVisible(true); // Close the popup
        } else {
          alert('Please select a point within the allowed area.');
        }
      },
    });
    return null;
  };

  useEffect(() => {
    if (popupVisible && markerRef.current) {
      markerRef.current.openPopup(); // Ensure popup is opened when marker is created
    }
  }, [popupVisible, popupLocation]);

  const handleSetOrigin = (e) => {
    e.stopPropagation();
    setRouteData(null);
    setOrigin(clickedLocation);
    setClickedLocation(null); // Close the popup
    setPopupVisible(false); // Close the popup
  };

  const handleSetDestination = (e) => {
    e.stopPropagation();
    setRouteData(null);
    setDestination(clickedLocation);
    setClickedLocation(null); // Close the popup
    setPopupVisible(false); // Close the popup
  };

  const handleRouting = async () => {
    setLoading(true);
    try {
      setRouteData(null);
      var data = await fetchGreenPathsPathsAndSegments(
        origin,
        destination,
        city,
        exposureType,
        transportMode
      );
      setRouteData(data);

      if (mapRef.current && origin && destination) {
        const bounds = L.latLngBounds([origin, destination]);
        mapRef.current.fitBounds(bounds, { padding: [100, 100] });
      }

      if (sidebarRef.current) {
        sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
        // Alternatively, scroll to a specific element:
        // document.getElementById('your-element-id').scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError('Failed to fetch route data');
    } finally {
      setLoading(false);
    }
  };

  // TODO: MAKE MAPPINGS FOR EACH EXPOSURE TYPE

  // Adjusted color mapping function
  const getColorBasedOnExposure = (value) => {
    if (value <= -0.75) return '#006400'; // Dark green for very good
    if (value > -0.75 && value <= -0.5) return '#32CD32'; // Lime green
    if (value > -0.5 && value < 0) return '#ADFF2F'; // Light green
    if (value === 0) return '#FFFF00'; // Yellow in the middle
    if (value > 0 && value < 0.5) return '#FFA500'; // Orange for bad exposure
    if (value >= 0.5 && value < 0.75) return '#FF6347'; // Light red
    if (value >= 0.75) return '#FF0000'; // Dark red for very bad
    return '#808080'; // Gray for undefined or unexpected values
  };

  const style = (feature) => {
    const exposureValue = feature.properties.exposure_norm_value;
    const color = getColorBasedOnExposure(exposureValue);

    return {
      color: color,
      weight: 4,
      opacity: 0.7,
    };
  };

  // TODO: REMOVE POPUP AND MAYBE MAKE FOCUS TO THE PATH
  const onEachFeature = (feature, layer) => {
    if (
      feature.properties &&
      feature.properties.exposure_norm_value !== undefined
    ) {
      layer.bindPopup(
        `<p>Exposure: ${feature.properties.exposure_norm_value}</p>`
      );
    }
  };

  const handleTransportChange = (mode) => {
    setTransportMode(mode);
    console.log(`Transport mode changed to: ${mode}`);
  };

  const handleExposureChange = (type) => {
    setExposureType(type);
    console.log(`Exposure type changed to: ${type}`);
  };

  const handlePathClick = (pathId, coordinates) => {
    // TODO: MAKE BETTER
    const markers = coordinates.map((coord) => ({
      lat: coord[1],
      lng: coord[0],
    }));
    setHighlightedMarkers(markers);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar open/close state
  };

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize(); // Invalidate map size to update it properly after sidebar toggles
      }, 300); // Add a small delay to match the CSS transition duration
    }
  }, [isSidebarOpen]); // Re-run this effect whenever the sidebar state changes

  const isRoutingDisabled = !origin | !destination;

  return (
    <div className="main-map-container">
      {/* TODO MAKE ERROR MESSAGE COMPONENT */}
      {/* display error message in a div */}
      {error && <div>{error}</div>}
      <MainSideBar
        ref={sidebarRef}
        handleRouting={handleRouting}
        handleExposureChange={handleExposureChange}
        handleTransportChange={handleTransportChange}
        handlePathClick={handlePathClick}
        transportMode={transportMode}
        exposureType={exposureType}
        isRoutingDisabled={isRoutingDisabled}
        routeData={routeData}
        origin={origin}
        destination={destination}
        loading={loading}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="map-container">
        <MapContainer
          center={helsinkiCenter}
          zoom={12}
          style={{ height: '100vh', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          <MapClickHandler />
          {popupVisible && popupLocation && (
            <Popup
              position={popupLocation}
              onClose={() => setPopupVisible(false)}
            >
              <div>
                <button onClick={handleSetOrigin}>Set Origin</button>
                <button onClick={handleSetDestination}>Set Destination</button>
              </div>
            </Popup>
          )}

          {routeData && (
            <>
              {/* <GeoJSON data={routeData.path_FC} onEachFeature={onEachFeature} /> */}
              <GeoJSON
                data={routeData.edge_FC}
                style={style}
                onEachFeature={onEachFeature}
              />
            </>
          )}

          {origin && <CircleMarker center={origin} color="green" radius={5} />}
          {destination && (
            <CircleMarker center={destination} color="orange" radius={5} />
          )}

          {/* TODO: MAKE WORK */}
          {/* Render Helsinki with normal color */}
          {/* <Polygon positions={helsinkiBorder} pathOptions={{ color: 'blue', fillOpacity: 0.5 }} /> */}

          {highlightedMarkers.map((marker, index) => (
            <CircleMarker
              key={index}
              center={[marker.lat, marker.lng]}
              radius={1}
              color="gray"
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MyMap;
