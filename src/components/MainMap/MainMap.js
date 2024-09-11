import React, { useState, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MainMap.css';

import { fetchGreenPathsPathsAndSegments } from '../../api/api';
import MainSideBar from '../MainSideBar/MainSideBar';
import EdgeLines from '../EdgeLines/EdgeLines';
import Legend from '../Legend/Legend';
import ODSelectButtons from '../ODSelectButtons/ODSelectButtons';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import InfoPopup from '../InfoPopup/InfoPopup';

function MyMap() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupLocation, setPopupLocation] = useState([51.505, -0.09]); // Default location

  const [highlightedPathId, setHighlightedPathId] = useState(null); // State to track highlighted path ID

  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [key, setKey] = useState(0);

  const [transportMode, setTransportMode] = useState('walking');
  const [exposureType, setExposureType] = useState('greenery');
  const [city] = useState('helsinki');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar open/close

  const [isPathClicked, setIsPathClicked] = useState(false);

  const markerRef = useRef(null);

  const mapRef = useRef();
  const sidebarRef = useRef();

  const helsinkiCenter = [60.1959, 24.9384];

  let clickedOnPath = false; // Use this flag to detect if a path was clicked

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
        if (!clickedOnPath && bounds.contains(e.latlng)) {
          setPopupLocation(e.latlng);
          setClickedLocation(e.latlng);
          setPopupVisible(true);
        }
        clickedOnPath = false; // Reset after handling the click
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
      var routeData = await fetchGreenPathsPathsAndSegments(
        origin,
        destination,
        city,
        exposureType,
        transportMode
      );
      setRouteData(routeData);

      if (mapRef.current && origin && destination) {
        const bounds = L.latLngBounds([origin, destination]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }

      if (routeData.path_FC.features.length > 0) {
        handlePathClick(
          routeData.path_FC.features[0].properties.path_id,
          routeData.path_FC.features[0].geometry.coordinates
        );
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

  const handleTransportChange = (mode) => {
    if (mode !== transportMode) {
      setTransportMode(mode);
      setRouteData(null);
    }
  };

  const handleExposureChange = (type) => {
    if (type !== exposureType) {
      setExposureType(type);
      setRouteData(null);
    }
  };

  const handlePathClick = (pathId, _, e) => {
    // if (e != null) {
    //   e.stopPropagation(); // Prevent the map click from firing
    // }
    clickedOnPath = true; // Path was clicked
    setHighlightedPathId(pathId);
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

  // TODO: MAKE WORK
  const handleError = () => {
    // Display the error message immediately
    setError('Something went wrong!');

    const timer = setTimeout(() => {
      setError(null);
    }, 5000);

    return () => clearTimeout(timer);
  };

  const isRoutingDisabled = !origin | !destination;

  useEffect(() => {
    if (mapRef.current && mapRef.current.leafletElement) {
      const map = mapRef.current.leafletElement;

      // Check if panes are not already created to avoid re-creating them
      if (!map.getPane('borderPane')) {
        map.createPane('borderPane');
        map.getPane('borderPane').style.zIndex = 399;
      }
      if (!map.getPane('linePane')) {
        map.createPane('linePane');
        map.getPane('linePane').style.zIndex = 400;
      }
    }
  }, [mapRef]);

  return (
    <div className="main-map-container">
      {error && <ErrorMessage error={error} />}
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
        highlightedPathId={highlightedPathId}
      />
      <div className="map-container">
        <MapContainer
          center={helsinkiCenter}
          zoom={12}
          style={{ height: '100vh', width: '100%' }}
          ref={mapRef}
        >
          {routeData && <Legend exposureType={exposureType} />}
          <InfoPopup />

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
              <ODSelectButtons
                handleSetOrigin={handleSetOrigin}
                handleSetDestination={handleSetDestination}
              />
            </Popup>
          )}

          {routeData && (
            <EdgeLines
              routeData={routeData}
              exposure={exposureType}
              highlightedPathId={highlightedPathId}
              handlePathClick={handlePathClick}
              zIndex={2}
              style={{ zIndex: 1 }}
              mapRef={mapRef}
            />
          )}

          {origin && <CircleMarker center={origin} color="green" radius={5} />}
          {destination && (
            <CircleMarker center={destination} color="purple" radius={5} />
          )}

          {/* TODO: MAKE WORK */}
          {/* Render Helsinki with normal color */}
          {/* <Polygon positions={helsinkiBorder} pathOptions={{ color: 'blue', fillOpacity: 0.5 }} /> */}
        </MapContainer>
      </div>
    </div>
  );
}

export default MyMap;
