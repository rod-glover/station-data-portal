import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CircleMarker } from 'react-leaflet';
import { map, find, flow, tap } from 'lodash/fp';

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
    networks: PropTypes.array,
  };

  static noStations = [];

  static network = (station, networks) => (
    find({ uri: station.network_uri })(networks)
  );

  render() {
    return (
      flow(
        tap(stations => console.log('stations', stations)),
        map(station => {
          const history = station.histories[0];
          const stn_nw = StationMarkers.network(station, this.props.networks);
          return (
            history &&
            <CircleMarker
              key={station.id}
              center={{
                lng: history.lon,
                lat: history.lat
              }}
              {...stationMarkerOptions}
              color={stn_nw.color}
            >
              <StationPopup station={station}/>
            </CircleMarker>
          )
        })
      )(this.props.stations || StationMarkers.noStations)
    );
  }
}

export default StationMarkers;
