import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import map from 'lodash/fp/map';
import get from 'lodash/fp/get';
import find from 'lodash/fp/find';
import isFunction from 'lodash/fp/isFunction';
import isString from 'lodash/fp/isString';

import logger from '../../../logger';

import './StationMetadata.css';
import FrequencySelector from '../../selectors/FrequencySelector';

logger.configure({ active: true });

const formatDate = d => d ? d.toISOString().substr(0,10) : 'unknown';


const columns = [
  {
    heading: 'Network',
    getter: (station, networks) => {
      const network = find({ uri: station.network_uri })(networks);
      return network ? network.name : '?';
    },
  },
  {
    heading: 'Native ID',
    getter: 'native_id'
  },
  {
    heading: 'Station Name',
    getter: 'histories[0].station_name'
  },
  {
    heading: 'Location',
    getter: station => {
      const hx = station.histories[0];
      return (
        <div>
          {-hx.lon} W <br/>
          {hx.lat} N <br/>
          Elev. {hx.elevation} m
        </div>
      );
    }
  },
  {
    heading: 'Record',
    // getter: station => 'record',
    getter: station => (
      <div>
        {formatDate(station.min_obs_time)} to <br/>
        {formatDate(station.max_obs_time)}
      </div>
    )
  },
  {
    heading: 'Obs Freq',
    getter: station =>
      FrequencySelector.valueToLabel(station.histories[0].freq),
  },
];

function value(getter, station, networks) {
  if (isString(getter)) {
    return get(getter, station);
  }
  if (isFunction(getter)) {
    return getter(station, networks);
  }
}

class StationMetadata extends Component {
  static propTypes = {
    stations: PropTypes.array,
    allNetworks: PropTypes.array.isRequired,
  };

  render() {
    return (
      <div className={'metadata'}>
        <Table condensed size={'sm'}>
          <thead>
          <tr>
            { map(col => <th>{col.heading}</th>)(columns) }
          </tr>
          </thead>
          <tbody>
          {
            map(station =>(
              <tr>
                {
                  map(col => (
                    <td>{value(col.getter, station, this.props.allNetworks)}</td>
                  ))(columns)
                }
              </tr>
            ))(this.props.stations)
          }
          </tbody>
        </Table>
      </div>
    );
  }
}

export default StationMetadata;
