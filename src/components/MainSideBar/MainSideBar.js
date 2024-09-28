import React, { forwardRef } from 'react';
import './MainSideBar.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import PathsResultInfo from '../PathResultsInfo/PathsResultsInfo';

import Typography from '@mui/material/Typography';
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import NoiseAwareIcon from '@mui/icons-material/VolumeUp';
import AirIcon from '@mui/icons-material/Air';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const MainSideBar = forwardRef(
  (
    {
      handleRouting,
      handleExposureChange,
      handleTransportChange,
      transportMode,
      exposureType,
      isRoutingDisabled,
      loading,
      routeData,
      handlePathClick,
      origin,
      destination,
      toggleSidebar,
      isSidebarOpen,
      highlightedPathId,
    },
    ref
  ) => {
    // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleGeoLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
      });
    };

    const cleanedCoordinates = (coordinates) => {
      return `${coordinates.lat.toFixed(2)}, ${coordinates.lng.toFixed(2)}`;
    };

    const convertExposureTypeToButtonText = (exposureType) => {
      switch (exposureType) {
        case 'greenery':
          return 'Greener';
        case 'noise':
          return 'Quiter';
        case 'airquality':
          return 'Cleaner Air';
        default:
          return 'Exposure';
      }
    };

    return (
      <div ref={ref} className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="main-title-container navbar-row">
          <Box className="main-title  hide-on-close">
            <img
              src={`${process.env.PUBLIC_URL}/GREENTRAVEL_logo_withDGL.jpg`}
              alt="GREENTRAVEL Logo"
              style={{ width: '5rem', marginRight: '1rem' }}
            />

            {/* Title */}
            <Typography
              variant="primary"
              component="div"
              className="main-title-text hide-on-close show-on-mobile"
              style={{ color: 'green', fontSize: '1.5rem' }}
            >
              Green Paths 2.0
            </Typography>
          </Box>
          <Button
            className="toggle-button"
            onClick={toggleSidebar}
            sx={{
              alignSelf: 'flex-end',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            {isSidebarOpen ? '⟨' : '⟩'}
          </Button>
        </div>
        {/* Transport Modes Row */}
        <div className="navbar-content hide-on-close">
          <div className="navbar-row">
            <ButtonGroup variant="outlined" orientation="horizontal">
              <Button
                variant={transportMode === 'walking' ? 'contained' : 'outlined'}
                onClick={() => handleTransportChange('walking')}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'none',
                  minWidth: '50px',
                }}
              >
                <DirectionsWalkIcon />
                <small>Walking</small>
              </Button>
              <Button
                variant={transportMode === 'cycling' ? 'contained' : 'outlined'}
                onClick={() => handleTransportChange('cycling')}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'none',
                  minWidth: '50px',
                }}
              >
                <PedalBikeIcon />
                <small>Cycling</small>
              </Button>
            </ButtonGroup>
          </div>

          <div className="navbar-row">
            <TextField
              variant="outlined"
              value={(origin && cleanedCoordinates(origin)) ?? ''}
              placeholder="Origin"
              onChange={handleGeoLocation}
              size="small"
              sx={{ margin: '5px' }}
            />
            <TextField
              variant="outlined"
              placeholder="Destination"
              value={(destination && cleanedCoordinates(destination)) ?? ''}
              onChange={handleGeoLocation}
              size="small"
              sx={{ margin: '5px' }}
            />
          </div>

          {/* Exposures Row */}
          <div className="navbar-row exposures">
            {['greenery', 'noise', 'airquality'].map((exposure) => (
              <Button
                key={exposure}
                variant={exposureType === exposure ? 'contained' : 'text'}
                onClick={() => handleExposureChange(exposure)}
                sx={{
                  backgroundColor:
                    exposureType === exposure
                      ? exposure === 'greenery'
                        ? '#4CAF50' // Green for greenery
                        : exposure === 'noise'
                          ? '#FFB300' // amber for noise
                          : '#4DB6AC' // Purple for air quality
                      : 'transparent',
                  color: exposureType === exposure ? 'white' : 'black',
                  border:
                    exposureType === exposure ? 'none' : '1px solid lightgray',
                  '&:hover': {
                    backgroundColor:
                      exposure === 'greenery'
                        ? '#388E3C' // Darker green for greenery hover
                        : exposure === 'noise'
                          ? '#FF8C00' // darker amber for noise hover
                          : '#00897B', // darker teal for air quality hover
                  },
                  '&.MuiButton-text': {
                    padding: '6px 12px',
                  },
                }}
              >
                {exposure === 'greenery' && <ForestOutlinedIcon />}
                {exposure === 'noise' && <NoiseAwareIcon />}
                {exposure === 'airquality' && <AirIcon />}
                <small>
                  {exposure.charAt(0).toUpperCase() + exposure.slice(1)}
                </small>
              </Button>
            ))}
          </div>
          <div className="navbar-row">
            <Button
              variant="contained"
              onClick={() => handleRouting()}
              disabled={isRoutingDisabled === 1 || loading ? true : false}
              style={{ color: 'white' }}
              sx={{
                backgroundColor:
                  exposureType === 'greenery'
                    ? '#4CAF50' // Green for greenery
                    : exposureType === 'noise'
                      ? '#FFB300' // amber
                      : '#4DB6AC', // teal
                '&:hover': {
                  backgroundColor:
                    exposureType === 'greenery'
                      ? '#388E3C' // Darker green for hover
                      : exposureType === 'noise'
                        ? '#FF8C00' // Darker orange for hover
                        : '#00897B', // Darker teal for hover
                },
              }}
            >
              {'Route ' +
                convertExposureTypeToButtonText(exposureType) +
                ' Paths'}
            </Button>
          </div>

          <div className="paths-result-info">
            {loading ? (
              // Display loading spinner when loading is true
              <div className="loading-circle">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <CircularProgress />
                </Box>
              </div>
            ) : (
              // Only render PathsResultInfo when routeData is available
              routeData && (
                <PathsResultInfo
                  loading={loading}
                  routeData={routeData}
                  transportMode={transportMode}
                  handlePathClick={handlePathClick}
                  highlightedPathId={highlightedPathId}
                  exposureType={exposureType}
                  onPathClick={() => {}}
                />
              )
            )}
          </div>
        </div>

        <div className="navbar-row navbar-logos hide-on-close">
          <img
            className="uaq2-logo"
            src={`${process.env.PUBLIC_URL}/UAQ20_Logo_Eng.png`}
            alt="UAQ 2.0 LOGO"
          />
          <img
            className="all-logos"
            src={`${process.env.PUBLIC_URL}/ALL_logos.jpg`}
            alt="ALL SPONSORS LOGOS"
            style={{ width: '5rem', marginRight: '1rem' }}
          />
        </div>
      </div>
    );
  }
);

export default MainSideBar;
