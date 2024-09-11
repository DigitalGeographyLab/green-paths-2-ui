import React, { useState, useEffect } from 'react';
import './PathsResultsInfo.css';
import { convertNames } from '../Conversions/NameConverter';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

// import clock icon from MUI
import ClockIcon from '@mui/icons-material/AccessTime';
// Import walking and cycling icons
import WalkingIcon from '@mui/icons-material/DirectionsWalk';
import CyclingIcon from '@mui/icons-material/DirectionsBike';
// import distance icon from MUI
import StraightenIcon from '@mui/icons-material/Straighten';

import ExposureBar from '../ExposureBars/ExposureBars';
import CumulativeExposureBar from '../CumulativeExposureBar/CumulativeExposureBar';

const PathsResultInfo = ({
  loading,
  routeData,
  highlightedPathId,
  // onPathClick,
  exposureType,
  handlePathClick,
  transportMode,
}) => {
  // first path open
  const [expanded, setExpanded] = useState(0);

  // Update expanded accordion when highlightedPathId changes
  useEffect(() => {
    const newIndex = routeData.path_FC.features.findIndex(
      (feature) => feature.properties.path_id === highlightedPathId
    );
    setExpanded(newIndex); // Set accordion to match highlighted path
  }, [highlightedPathId, routeData]);

  const handleAccordionChange = (panelIndex) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelIndex : false);
  };

  const setTransportIcon = (transportMode) => {
    switch (transportMode) {
      case 'walking':
        return <WalkingIcon sx={{ padding: '.25rem' }} />;
      case 'cycling':
        return <CyclingIcon sx={{ padding: '.25rem' }} />;
      default:
        return <WalkingIcon sx={{ padding: '.25rem' }} />;
    }
  };

  const formatMinutesDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`;
  };

  const calculateDepartureAndArrivalTimes = (tripDurationMinutes) => {
    const now = new Date(); // Current time as departure time

    // Function to add minutes to a date
    const addMinutes = (date, minutes) => {
      return new Date(date.getTime() + minutes * 60000);
    };

    // Calculate the departure time
    const departureTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Calculate the arrival time by adding the trip duration
    const arrivalTime = addMinutes(now, tripDurationMinutes).toLocaleTimeString(
      [],
      { hour: '2-digit', minute: '2-digit' }
    );

    return `${departureTime} - ${arrivalTime}`;
  };

  return (
    <div className="paths-results-info-box">
      {/* // Display route data when loading is false */}
      {routeData.path_FC.features.map((feature, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={handleAccordionChange(index)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            onClick={
              () => handlePathClick(feature.properties.path_id)
              // onPathClick(
              //   feature.properties.path_id,
              //   feature.geometry.coordinates
              // )
            }
            sx={{
              justifyContent: 'center',
              marginBottom: '.5rem',
              boxShadow:
                feature.properties.path_id === highlightedPathId
                  ? '0px -1px 5px black, 1px 0px 5px black, -1px 0px 5px black'
                  : '0px',
              fontWeight:
                feature.properties.path_id === highlightedPathId
                  ? 'bold'
                  : 'normal',
              color:
                feature.properties.path_id === highlightedPathId
                  ? 'black'
                  : 'dark gray',
            }}
          >
            <div
              style={{
                width: '100%',
              }}
            >
              <div
                className="path-info-row"
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <div className="travel-duration-info-item">
                  <ClockIcon sx={{ padding: '.25rem' }} />
                  {calculateDepartureAndArrivalTimes(feature.properties.Time)}
                </div>
                <div className="travel-duration-info-item">
                  {setTransportIcon(transportMode)}
                  {formatMinutesDuration(feature.properties.Time)}
                </div>
                <div className="travel-duration-info-item">
                  <StraightenIcon sx={{ padding: '.25rem' }} />
                  {feature.properties.Length}
                </div>
              </div>

              <div className="exposurebars-row">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    width: '100%',
                  }}
                >
                  <ExposureBar
                    exposureType="greenery"
                    exposureValue={feature.properties.greenery_average}
                    goodExposure={true}
                  />

                  <ExposureBar
                    exposureType="noise"
                    exposureValue={feature.properties.noise_average}
                    goodExposure={false}
                  />
                  <ExposureBar
                    exposureType="airQuality"
                    exposureValue={feature.properties.airquality_average}
                    goodExposure={false}
                  />
                </Box>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="feature-properties">
              <CumulativeExposureBar
                cumulativeExposures={
                  feature.properties.cumulative_exposure || {}
                }
                exposureType={exposureType}
              />

              {/* <ul>
                {Object.entries(convertNames(feature.properties)).map(
                  ([key, value]) => {
                    if (
                      ![
                        'path_id',
                        'to_id',
                        'from_id',
                        'cumulative_exposure',
                      ].includes(key)
                    ) {
                      return (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      );
                    }
                    return null;
                  }
                )}
              </ul> */}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default PathsResultInfo;
