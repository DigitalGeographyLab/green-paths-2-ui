import React, { useState } from 'react';
import './PathsResultsInfo.css';
import { convertNames } from '../Conversions/NameConverter';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PathsResultInfo = ({ loading, routeData, onPathClick }) => {
  // first path open
  const [expanded, setExpanded] = useState(0);

  const handleAccordionChange = (panelIndex) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelIndex : false);
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
            onClick={() =>
              onPathClick(
                feature.properties.path_id,
                feature.geometry.coordinates
              )
            }
          >
            <Typography>Path {index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="feature-properties">
              <ul>
                {Object.entries(convertNames(feature.properties)).map(
                  ([key, value]) => {
                    if (!['path_id', 'to_id', 'from_id'].includes(key)) {
                      return (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      );
                    }
                    return null;
                  }
                )}
              </ul>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default PathsResultInfo;
