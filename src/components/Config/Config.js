const exposureLimits = {
  greenery: { min: 0, max: 50 }, // Example range for greenery
  noise: { min: 0, max: 100 }, // Example range for noise
  airQuality: { min: 1, max: 5 }, // Example range for air quality (e.g., AQI scale)
};

// Function to determine the color based on the normalized percentage
const getBarColor = (normalizedPercentage) => {
  if (normalizedPercentage <= 20) return '#8B00FF'; // Very bad (Purple)
  if (normalizedPercentage <= 40) return '#FF0000'; // Bad (Red)
  if (normalizedPercentage <= 60) return '#FFA500'; // Moderate (Orange)
  if (normalizedPercentage <= 80) return '#ADFF2F'; // Good (Light Green)
  return '#008000'; // Very good (Dark Green)
};
