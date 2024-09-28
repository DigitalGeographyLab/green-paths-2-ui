import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import './ExposureBars.css';

const ExposureBars = ({ exposureType, exposureValue, aqiUpdatedTimestamp }) => {
  // Define thresholds for each exposure type
  const exposureRanges = {
    greenery: {
      thresholds: [10, 20, 30, 40], // Greenery ranges
      goodExposure: true, // Higher is better
    },
    airQuality: {
      thresholds: [2, 3, 4, 5, 6], // AQI ranges
      goodExposure: false, // Lower is better
    },
    noise: {
      thresholds: [55, 59, 64, 69, 75], // Noise ranges
      goodExposure: false, // Lower is better
    },
  };

  const exposureBarColors = {
    greenery: ['#FF6347', '#FFA07A', '#FFD700', '#7FBF7F', '#2E7D32'], // Best value now a bit more green
    airQuality: ['#FF6347', '#FFA07A', '#FFD700', '#7FBF7F', '#2E7D32'], // Same for air quality
    noise: ['#FF6347', '#FFA07A', '#FFD700', '#7FBF7F', '#2E7D32'], // Same for noise
  };

  // Get the exposure configuration for the current exposure type
  const exposureConfig = exposureRanges[exposureType] || {
    thresholds: [0], // Default
    goodExposure: true, // Default
  };

  // Get the colors specific to the exposure type
  const colors = exposureBarColors[exposureType] || ['#808080']; // Default to gray if not found

  // Determine which "step" the value falls into (e.g., 20%, 40%, etc.)
  const getProgressStep = (value, thresholds) => {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (value >= thresholds[i]) {
        return (i + 1) / thresholds.length; // Return the step as a fraction (e.g., 0.2, 0.4)
      }
    }
    return 0; // If below all thresholds
  };

  // Calculate the progress percentage and color based on the step
  const getProgressPercentageAndColor = (value, thresholds, goodExposure) => {
    const step = getProgressStep(value, thresholds); // Get the step (0.2, 0.4, etc.)

    // Calculate progress percentage and flip if needed
    const progress = goodExposure ? step * 100 : (1 - step) * 100;

    // Get the corresponding color for this step (flip if needed)
    const colorIndex = goodExposure
      ? Math.floor(step * (colors.length - 1))
      : Math.floor((1 - step) * (colors.length - 1));
    const barColor = colors[colorIndex];

    return { progress, barColor };
  };

  // Get the progress percentage and color for the bar
  const { progress, barColor } = getProgressPercentageAndColor(
    exposureValue,
    exposureConfig.thresholds,
    exposureConfig.goodExposure
  );

  function formatAqiDateTime(dateTimeString) {
    // Split the string at 'T' to separate date and time
    const [date, time] = dateTimeString.split('T');

    // Format time by appending ':00' if it's missing minutes
    const formattedTime = time.length === 2 ? `${time}:00` : time;

    // Return the date and formatted time
    return `${date}, ${formattedTime}`;
  }

  // If the exposure value is missing, render a "Not Available" header and gray progress bar
  if (exposureValue === undefined || exposureValue === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          gap: 1,
          mb: 2,
          width: '100%',
        }}
      >
        {/* Exposure name above the bar */}
        <Typography
          variant="subtitle2"
          sx={{
            textAlign: 'center',
          }}
        >
          {exposureType.charAt(0).toUpperCase() +
            exposureType.slice(1) +
            ' Not available'}
        </Typography>

        {/* Progress Bar */}
        <Box
          sx={{
            position: 'relative',
            width: '100%', // Take the full width of the container
            display: 'flex', // Flex for alignment
            justifyContent: 'center', // Centering the content
          }}
        >
          {/* Value inside the bar */}
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              width: '100%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#000', // White text for visibility inside the bar
              textAlign: 'center',
              fontWeight: 'bold',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {exposureValue}
          </Typography>

          {/* Linear Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{
              height: 20, // Increased height to make the text more visible
              width: '100%', // Make the bar take the full available width
              borderRadius: 5,
              backgroundColor: 'lightgray',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'gray', // Set dynamic color based on step
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <div className="exposure-bar">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          gap: 1,
          mb: 2,
          width: '100%',
        }}
      >
        {/* Exposure name above the bar */}
        <Typography
          variant="subtitle2"
          sx={{
            textAlign: 'center',
          }}
        >
          {exposureType === 'noise'
            ? 'Quietness'
            : exposureType.charAt(0).toUpperCase() + exposureType.slice(1)}
        </Typography>
        <Box
          sx={{
            width: '100%', // Full width of the container
            display: 'flex', // Flexbox layout
            flexDirection: 'column', // Stack the children vertically
            alignItems: 'center', // Center horizontally
            position: 'relative',
          }}
        >
          {/* Progress Bar */}
          <Box
            sx={{
              position: 'relative',
              width: '100%', // Full width of the container
              display: 'flex', // Flex for alignment
              justifyContent: 'center', // Centering the content
            }}
          >
            {/* Value inside the bar */}
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                width: '100%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#000', // Black text for visibility inside the bar
                textAlign: 'center',
                fontWeight: 'bold',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {exposureValue}
            </Typography>

            {/* Linear Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 20, // Increased height for better visibility
                width: '100%',
                borderRadius: 5,
                backgroundColor: 'lightgray',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: barColor, // Set dynamic color based on step
                },
              }}
            />
          </Box>

          {/* AQI Updated Timestamp */}
          {aqiUpdatedTimestamp && aqiUpdatedTimestamp !== '' && (
            <Typography
              variant="body2"
              sx={{
                marginTop: 1,
                color: 'gray',
                fontSize: '75%',
              }}
            >
              AQI updated: {formatAqiDateTime(aqiUpdatedTimestamp)}
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default ExposureBars;
