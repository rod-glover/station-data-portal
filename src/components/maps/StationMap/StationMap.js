import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { BCBaseMap } from 'pcic-react-leaflet-components';
import { FeatureGroup, LayerGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import StationMarkers from '../StationMarkers';

import logger from '../../../logger';

import './StationMap.css';

logger.configure({ active: true });

export default class StationMap extends Component {
  static propTypes = {
    stations: PropTypes.array.isRequired,
    allNetworks: PropTypes.array.isRequired,
    allVariables: PropTypes.array.isRequired,
  };

  state = {};

  render() {
    const allowGeometryDraw = true || this.state.geometryLayers.length === 0;

    return (
      <BCBaseMap viewport={BCBaseMap.initialViewport}>
        <FeatureGroup>
          <EditControl
            position={'topleft'}
            draw={{
              marker: false,
              circlemarker: false,
              circle: false,
              polyline: false,
              polygon: allowGeometryDraw && {
                showArea: false,
                showLength: false,
              },
              rectangle: allowGeometryDraw && {
                showArea: false,
                showLength: false,
              },
            }}
          />
        </FeatureGroup>
        <LayerGroup>
          <StationMarkers
            stations={this.props.stations}
            allNetworks={this.props.allNetworks}
            allVariables={this.props.allVariables}
          />
        </LayerGroup>
      </BCBaseMap>

    );
  }
}

