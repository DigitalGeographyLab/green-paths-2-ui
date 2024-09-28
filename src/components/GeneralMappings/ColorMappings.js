export const colorMappings = {
  greenery: [
    { threshold: -1, color: 'gray', label: 'no data' }, // no data
    { threshold: 14, color: '#C19A6B', label: '0-14' }, // Light brown
    { threshold: 29, color: '#BC8F8F', label: '14-29' }, // Rosy brown
    { threshold: 44, color: '#EEDD82', label: '29-44' }, // Dark khaki
    { threshold: 59, color: '#76C17E', label: '44-59' }, // Soft green
    { threshold: Infinity, color: '#228B22', label: '59+' }, // Forest green (more green)
  ],
  noise: [
    { threshold: -1, color: 'gray', label: 'no data' }, // no data
    { threshold: 54, color: '#5F9EA0', label: '0-54' }, // Cadet blue
    { threshold: 59, color: '#90EE90', label: '54-59' }, // Light green
    { threshold: 64, color: '#FFEC8B', label: '59-64' }, // Light goldenrod yellow
    { threshold: 69, color: '#F4A460', label: '64-69' }, // Sandy brown
    { threshold: Infinity, color: '#FF4500', label: '69+' }, // Orange red
  ],
  airquality: [
    { threshold: -1, color: 'gray', label: 'no data' }, // no data
    { threshold: 1, color: '#90EE90', label: '0-1' }, // Light green
    { threshold: 2, color: '#FFD700', label: '1-2' }, // Gold
    { threshold: 3, color: '#FFA07A', label: '2-3' }, // Light salmon
    { threshold: 4, color: '#FF4500', label: '3-4' }, // Orange red
    { threshold: Infinity, color: '#DA70D6', label: '4-5' }, // Orchid (darker violet)
  ],
};
