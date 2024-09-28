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
import * as turf from '@turf/turf';

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

  // const [hmaBoundaryPoly, setHmaBoundaryPoly] = useState(null);

  const markerRef = useRef(null);

  const mapRef = useRef();
  const sidebarRef = useRef();

  const helsinkiCenter = [60.1959, 24.9384];

  let clickedOnPath = false; // Use this flag to detect if a path was clicked

  const [hmaBoundaryLine, setHmaBoundaryLine] = useState(null);

  useEffect(() => {
    fetch('/boundaries/HMA_single_line_boundaries_4326.geojson')
      .then((response) => response.json())
      .then((data) => setHmaBoundaryLine(data))
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, []);

  useEffect(() => {
    if (hmaBoundaryLine && mapRef.current) {
      const geoJsonLayer = L.geoJSON(hmaBoundaryLine);
      const bounds = geoJsonLayer.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [150, 150] });
      // mapRef.current.addLayer(geoJsonLayer); // Ensure the layer is added to the map
      const map = mapRef.current;
      // map.setMaxBounds(bounds, { padding: [1000, 1000] }); // Limit the map to the bounding box
      map.setMinZoom(10); // Restrict zoom-out level
      map.setZoom(13); // Set initial zoom level
    }
  }, [hmaBoundaryLine]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (hmaBoundaryLine && e.latlng) {
          const clickedLatLng = [e.latlng.lng, e.latlng.lat]; // Turf uses [lng, lat] order
          const point = turf.point(clickedLatLng);

          let isInside = false;

          hmaBoundaryLine.features.forEach((feature) => {
            const polygon = turf.polygon(feature.geometry.coordinates);
            if (turf.booleanPointInPolygon(point, polygon)) {
              isInside = true;
            }
          });

          if (isInside) {
            console.log('Clicked inside the boundary');
            setPopupLocation(e.latlng);
            setClickedLocation(e.latlng);
            setPopupVisible(true);
          } else {
            console.log('Clicked outside the boundary');
            handleError(
              'Please select a location within Helsinki Metropolitan Area',
              3000
            );
          }
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
      var routeData = await fetchGreenPathsPathsAndSegments(
        origin,
        destination,
        city,
        exposureType,
        transportMode
      );
      setRouteData(routeData);

      // set error if only 1 path is returned
      if (routeData.path_FC.features.length === 1) {
        handleError('Only fastest path found, no alternative paths available');
      }

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
      if (err.response && err.response.data && err.response.data.detail) {
        handleError(err.response.data.detail); // Extract error message from "detail"
      } else {
        handleError('An unknown error occurred.'); // Fallback for generic errors
      }
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
    clickedOnPath = true;
    setHighlightedPathId(pathId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize(); // Invalidate map size to update it properly after sidebar toggles
      }, 300);
    }
  }, [isSidebarOpen]); // Re-run this effect whenever the sidebar state changes

  const handleError = (errorMessage, timeoutSeconds) => {
    // Display the error message immediately
    setError(errorMessage);

    const timer = setTimeout(() => {
      setError(null);
    }, timeoutSeconds || 5000);

    return () => clearTimeout(timer);
  };

  const isRoutingDisabled = !origin | !destination;

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

          {hmaBoundaryLine && (
            <GeoJSON
              data={hmaBoundaryLine}
              style={{
                color: 'gray',
                fillOpacity: 0,
                zIndex: 999,
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default MyMap;
