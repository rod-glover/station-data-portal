import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Popup } from 'react-leaflet'

import logger from '../../../logger';

import './StationPopup.css';

logger.configure({ active: true });

class StationPopup extends Component {
  static propTypes = {
    station: PropTypes.object,
  };

  render() {
    return (
      <Popup>
        {this.props.station.histories[0].station_name}
      </Popup>
    );
  }
}

export default StationPopup;
