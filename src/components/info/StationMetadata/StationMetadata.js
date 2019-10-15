// This component renders a table showing a selected subset of station metadata.
// This component wraps React Table v6. All props passed to this component are
// passed into React Table.

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTable from 'react-table';
import find from 'lodash/fp/find';
import FrequencySelector from '../../selectors/FrequencySelector';
import logger from '../../../logger';

import 'react-table/react-table.css';
import './StationMetadata.css';


logger.configure({ active: true });

const formatDate = d => d ? d.toISOString().substr(0,10) : 'unknown';


export default class StationMetadata extends Component {
  static propTypes = {
    stations: PropTypes.array,
    allNetworks: PropTypes.array.isRequired,
  };

  render() {
    const { stations, allNetworks, ...restProps } = this.props;

    const columns = [
      {
        id: 'Network',
        Header: 'Network',
        minWidth: 80,
        maxWidth: 100,
        accessor: station => {
          const network = find({ uri: station.network_uri })(allNetworks);
          return network ? network.name : '?';
        },
      },
      {
        id: 'Native ID',
        Header: 'Native ID',
        minWidth: 80,
        maxWidth: 100,
        accessor: 'native_id'
      },
      {
        id: 'Station Name',
        Header: 'Station Name',
        minWidth: 120,
        maxWidth: 200,
        accessor: station => station.histories[0].station_name,
      },
      {
        id: 'Location',
        Header: 'Location',
        minWidth: 120,
        maxWidth: 200,
        accessor: station => {
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
        id: 'Record',
        Header: 'Record',
        minWidth: 100,
        maxWidth: 200,
        // accessor: station => 'record',
        accessor: station => {
          return (
          <div>
            {formatDate(station.min_obs_time)} to <br/>
            {formatDate(station.max_obs_time)}
          </div>
        )}
      },
      {
        minWidth: 80,
        maxWidth: 100,
        id: 'Obs Freq',
        Header: 'Obs Freq',
        accessor: station =>
          FrequencySelector.valueToLabel(station.histories[0].freq),
      },
    ];

    return (
      <ReactTable
        data={stations}
        columns={columns}
        defaultPageSize={100}
        {...restProps}
      />
    );
  }
}
