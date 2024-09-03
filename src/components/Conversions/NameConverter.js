// Define a mapping object where API keys are the keys and user-friendly names are the values
const keyMapping = {
  length: 'Length (m)',
  gvi_lines_time_weighted_path_exposure_sum: 'sum exposure',
  gvi_lines_min_exposure: 'min exposure',
  gvi_lines_time_weighted_path_exposure_avg: 'average exposure',
  // Add more mappings
};

// Function to convert API keys to user-friendly names
const convertNames = (properties) => {
  const convertedProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    // Use the mapped name if it exists, otherwise use the original key
    const convertedKey = keyMapping[key] || key;
    convertedProperties[convertedKey] = value;
  }

  return convertedProperties;
};

export { convertNames };
