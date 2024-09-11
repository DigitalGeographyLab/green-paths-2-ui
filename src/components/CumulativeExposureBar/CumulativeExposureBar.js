import React from 'react';
import { Box, Typography } from '@mui/material';
import { colorMappings } from '../GeneralMappings/ColorMappings';

// Helper function to convert seconds to minutes
const secondsToMinutes = (seconds) => {
  if (seconds < 60) {
    return `${seconds.toFixed(0)} sec`;
  } else {
    return `${(seconds / 60).toFixed(0)} min`;
  }
};

const getTotalTime = (data) =>
  Object.values(data).reduce((acc, val) => acc + val, 0);

const getColorForExposure = (value, exposureType) => {
  const mapping = colorMappings[exposureType];
  if (!mapping) return { color: '#000', rangeLabel: 'other' }; // Fallback to black if no mapping exists

  // Iterate through the mappings and return the correct color and label
  for (const { threshold, color, label } of mapping) {
    if (value <= threshold) {
      return { color, rangeLabel: label };
    }
  }

  // Return the highest color if the value exceeds all thresholds
  const highestMapping = mapping[mapping.length - 1];
  return { color: highestMapping.color, rangeLabel: highestMapping.label };
};

const mergeRangesByColor = (cumulativeExposures, exposureType) => {
  const mergedExposures = {};

  Object.entries(cumulativeExposures).forEach(([range, time]) => {
    const value = parseFloat(range.split('-')[0]);
    const { color, rangeLabel } = getColorForExposure(value, exposureType);

    // If the color already exists, add the time; otherwise, create a new entry
    if (mergedExposures[color]) {
      mergedExposures[color].time += time;

      // Only update rangeLabel if the new one is larger
      if (
        parseFloat(rangeLabel.split('-')[0]) >
        parseFloat(mergedExposures[color].rangeLabel.split('-')[0])
      ) {
        mergedExposures[color].rangeLabel = rangeLabel;
      }
    } else {
      mergedExposures[color] = {
        time,
        rangeLabel,
      };
    }
  });

  return mergedExposures;
};

const CumulativeExposureBar = ({ cumulativeExposures, exposureType }) => {
  if (!cumulativeExposures || Object.keys(cumulativeExposures).length === 0) {
    return <Typography>No cumulative exposure data available.</Typography>;
  }

  const exposureMapping = colorMappings[exposureType]; // Get the specific exposure mapping
  const totalTime = Object.values(cumulativeExposures).reduce(
    (acc, val) => acc + val,
    0
  ); // Ensure the total time remains

  // Function to find the correct color for each threshold
  const getColorForRange = (value) => {
    for (const { threshold, color } of exposureMapping) {
      if (value <= threshold) return color;
    }
    return '#000'; // Default to black if not found
  };

  // Function to get the label for each range
  const getLabelForRange = (value) => {
    for (const { threshold, label } of exposureMapping) {
      if (value <= threshold) return label;
    }
    return 'other';
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Visual Bar */}
      <Box
        sx={{
          display: 'flex',
          height: '1rem',
          borderRadius: 5,
          overflow: 'hidden',
          border: '1px solid lightgray',
        }}
      >
        {Object.entries(cumulativeExposures).map(([range, time]) => {
          const percentage = (time / totalTime) * 100; // Get percentage of total time
          const color = getColorForRange(parseFloat(range)); // Get the color from the mapping

          return (
            <Box
              key={range}
              sx={{
                width: `${percentage}%`, // Set the width proportional to the time
                backgroundColor: color,
                display: 'inline-block',
                height: '100%',
              }}
            ></Box>
          );
        })}
      </Box>

      {/* Listing of Ranges and Time */}
      <Box
        sx={{
          marginTop: '0.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)', // Two columns layout
          justifyItems: 'center',
        }}
      >
        {Object.entries(cumulativeExposures).map(([range, time]) =>
          time === 0 ? null : (
            <Box
              key={range}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  margin: '.25rem',
                  padding: '.5rem 0',
                  width: '4rem',
                  backgroundColor: getColorForRange(parseFloat(range)), // Get color based on range
                  color: 'black',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '69%',
                }}
              >
                {getLabelForRange(parseFloat(range))}{' '}
                {/* Display the correct label */}
              </Box>
              <Typography variant="body2">{secondsToMinutes(time)}</Typography>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default CumulativeExposureBar;
