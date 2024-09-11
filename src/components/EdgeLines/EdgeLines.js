import React, { useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { colorMappings } from '../GeneralMappings/ColorMappings';

const EdgeLines = ({
  routeData,
  exposure,
  highlightedPathId,
  handlePathClick,
  mapRef,
}) => {
  const exposureType = exposure;

  const getBorderStyle = (feature) => {
    if (feature.properties.path_id === highlightedPathId) {
      return {
        color: 'black', // border color
        weight: 10, // border thickness (make it thick enough but not overwhelming)
        opacity: 0.8, // slightly transparent so inner color can shine through
      };
    }
    return { opacity: 0 };
  };

  const getInnerLineStyle = (feature) => {
    const exposureValue = feature.properties.exposure_value;
    const mappings = colorMappings[exposureType];

    for (const { threshold, color } of mappings) {
      if (exposureValue <= threshold) {
        return {
          color: color,
          weight: feature.properties.path_id === highlightedPathId ? 6 : 4, // make inner line thinner than border
          opacity: 1, // full opacity for inner line
        };
      }
    }

    return {
      color: '#808080',
      weight: 4,
      opacity: 1,
    };
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.path_id) {
      layer.on({
        click: (e) => {
          handlePathClick(
            feature.properties.path_id,
            feature.geometry.coordinates,
            e
          ); // Pass event to handlePathClick
        },
      });
    }
  };

  return (
    <>
      {/* Force re-rendering of the border when the path ID changes */}
      <GeoJSON
        key={`border-${highlightedPathId}`} // unique key for borders to force re-rendering
        data={routeData.edge_FC.features.filter(
          (f) => f.properties.path_id === highlightedPathId
        )}
        style={getBorderStyle}
        onEachFeature={onEachFeature}
      />

      {/* Force re-rendering of the inner lines */}
      <GeoJSON
        key={`inner-${highlightedPathId}`} // unique key for inner lines to force re-rendering
        data={routeData.edge_FC}
        style={getInnerLineStyle}
        onEachFeature={onEachFeature}
      />
    </>
  );
};

export default EdgeLines;
