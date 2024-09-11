import React from 'react';
import Button from '@mui/material/Button';

const ODSelectButtons = ({ handleSetOrigin, handleSetDestination }) => {
  return (
    <div>
      <Button
        variant="contained" // You can also use "outlined" or "text" variants
        color="primary" // green
        onClick={handleSetOrigin}
        style={{ marginRight: '.5rem', color: 'white' }} // Add margin to space out the buttons
      >
        Set Origin
      </Button>

      <Button
        variant="contained"
        color="secondary" // purple
        onClick={handleSetDestination}
        style={{ color: 'white' }} // Add margin to space out the buttons
      >
        Set Destination
      </Button>
    </div>
  );
};

export default ODSelectButtons;
