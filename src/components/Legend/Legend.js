// Legend.js
import React from 'react';
import { colorMappings } from '../GeneralMappings/ColorMappings';
import './Legend.css';

const Legend = ({ exposureType }) => {
  const mappings = colorMappings[exposureType];

  return (
    <div className="legend-container">
      <h4 style={{ margin: '.2rem' }}>
        {exposureType.charAt(0).toUpperCase() + exposureType.slice(1)}
      </h4>
      <ul style={{ listStyleType: 'none', padding: 0, margin: '.2rem' }}>
        {mappings.map(({ threshold, color }, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>
            <span
              style={{
                backgroundColor: color,
                display: 'inline-block',
                width: '20px',
                height: '20px',
                marginRight: '10px',
                verticalAlign: 'middle',
              }}
            ></span>
            {index === 0
              ? 'no data'
              : index === mappings.length - 1
                ? `> ${mappings[index - 1].threshold}`
                : `${mappings[index - 1].threshold + 1} - ${threshold}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
