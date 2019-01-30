import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CircleMarker } from 'react-leaflet';
import { map, flow, tap } from 'lodash/fp';

import logger from '../../../logger';

import './StationMarkers.css';
import StationPopup from '../StationPopup';

logger.configure({ active: true });


// TODO: Make static prop of class?
const stationMarkerOptions = {
  radius: 8,
  weight: 1,
  fillOpacity: 0.75,
};

class StationMarkers extends Component {
  static propTypes = {
    stations: PropTypes.array,
  };

  static noStations = [];

  render() {
    return (
      flow(
        tap(stations => console.log('stations', stations)),
        map(station =>
          station.histories[0] &&
          <CircleMarker
            key={station.id}
            center={{
              lng: station.histories[0].lon,
              lat: station.histories[0].lat
            }}
            {...stationMarkerOptions}
          >
            <StationPopup station={station}/>
          </CircleMarker>
        )
      )(this.props.stations || StationMarkers.noStations)
    );
  }
}

export default StationMarkers;