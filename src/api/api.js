import axios from 'axios';

// LOCAL API BASE URL
const BASE_URL = 'http://127.0.0.1:8000';

export const fetchGreenPathsPathsAndSegments = async (
  origin,
  destination,
  city,
  exposure,
  transportMode
) => {
  try {
    // Extract latitude and longitude and convert them to the expected format
    const formattedOrigin = [origin.lat, origin.lng];
    const formattedDestination = [destination.lat, destination.lng];

    const response = await axios.post(`${BASE_URL}/route/`, {
      city: city,
      origin: formattedOrigin,
      destination: formattedDestination,
      exposure: exposure,
      transportMode: transportMode,
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching route data:', error);
    throw error;
  }
};
