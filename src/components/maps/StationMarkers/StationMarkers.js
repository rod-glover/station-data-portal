import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CircleMarker } from 'react-leaflet';
import { map, find, flow, tap } from 'lodash/fp';

import logger from '../../../logger';

import './StationMarkers.css';
import StationPopup from '../StationPopup';

logger.configure({ active: true });


const noStations = [];

const network = (station, networks) => (
  find({ uri: station.network_uri })(networks)
);

class StationMarkers extends Component {
  static propTypes = {
    stations: PropTypes.array.isRequired,
    networks: PropTypes.array.isRequired,
    markerOptions: PropTypes.object,
  };

  static defaultProps = {
    markerOptions: {
      radius: 4,
      weight: 1,
      fillOpacity: 0.75,
      color: '#000000',
    },
  };

  render() {
    return (
      flow(
        tap(stations => console.log('stations', stations)),
        map(station => {
          const history = station.histories[0];
          const nw = network(station, this.props.networks);
          return (
            history &&
            <CircleMarker
              key={station.id}
              center={{
                lng: history.lon,
                lat: history.lat
              }}
              {...this.props.markerOptions}
              color={nw && nw.color}
            >
              <StationPopup station={station}/>
            </CircleMarker>
          )
        })
      )(this.props.stations || noStations)
    );
  }
}

export default StationMarkers;
