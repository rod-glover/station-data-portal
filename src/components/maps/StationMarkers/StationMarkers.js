import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CircleMarker } from 'react-leaflet';
import { map, find, flow, tap } from 'lodash/fp';

import logger from '../../../logger';

import './StationMarkers.css';
import StationPopup from '../StationPopup';

logger.configure({ active: true });


const noStations = [];


const network_for = (station, networks) => (
  find({ uri: station.network_uri })(networks)
);


const variables_for = (history, variables) => (
  // history.variable_uris
  map(
    variable_uri => find({ uri: variable_uri })(variables)
  )(history.variable_uris)
);


class StationMarkers extends Component {
  static propTypes = {
    stations: PropTypes.array.isRequired,
    allNetworks: PropTypes.array.isRequired,
    allVariables: PropTypes.array.isRequired,
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
          const network = network_for(station, this.props.allNetworks);
          const variables = variables_for(history, this.props.allVariables);
          return (
            history &&
            <CircleMarker
              key={station.id}
              center={{
                lng: history.lon,
                lat: history.lat
              }}
              {...this.props.markerOptions}
              color={network && network.color}
            >
              <StationPopup
                station={station}
                network={network}
                variables={variables}
              />
            </CircleMarker>
          )
        })
      )(this.props.stations || noStations)
    );
  }
}

export default StationMarkers;
