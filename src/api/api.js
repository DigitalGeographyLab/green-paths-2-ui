import axios from 'axios';

// get GP2 API URL from environment variables
const apiUrl = process.env.REACT_APP_GP2_API_URL;

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

    const response = await axios.post(`${apiUrl}/route/`, {
      city: city,
      origin: formattedOrigin,
      destination: formattedDestination,
      exposure: exposure,
      transportMode: transportMode,
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};
