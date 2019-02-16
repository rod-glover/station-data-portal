import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { flow, map, reduce } from 'lodash/fp';
import { getObservationCounts } from
    '../../../data-services/station-data-service';

import logger from '../../../logger';

import './ObservationCounts.css';

logger.configure({ active: true });

class ObservationCounts extends Component {
  static propTypes = {
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    stations: PropTypes.array,
  };

  state = {
    countData: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.startDate !== state.prevStartDate ||
      props.endDate !== state.prevEndDate
      // props.stations !== state.prevStations
    ) {
      return {
        countData: null,  // Signal need for new data
        prevStartDate: props.startDate,
        prevEndDate: props.endDate,
        // prevStations: props.stations,  // Request doesn't depend on stations
      };
    }

    // No state update necessary
    return null;
  }

  componentDidMount() {
    this.loadObservationCounts();
  }

  componentDidUpdate() {
    if (this.state.countData === null) {
      this.loadObservationCounts();
    }
  }

  loadObservationCounts() {
    const { startDate, endDate} = this.props;
    // TODO: getObservationCounts should assemble params
    getObservationCounts({
      params: {
        start_date: startDate,
        end_date: endDate,
      }
    }).then(response => this.setState({ countData: response.data }));
  }

  render() {
    const { countData } = this.state;
    if (countData === null) {
      return <p>Loading counts...</p>
    }

    const totalCounts = (counts, stations) => (
      reduce((sum, station) => sum + (counts[station.id] || 0), 0)(stations)
    );

    const totalObservationCountsForStations =
      totalCounts(countData.observationCounts, this.props.stations);
    const totalClimatologyCountsForStations =
      totalCounts(countData.climatologyCounts, this.props.stations);

    return (
      <Table condensed size="sm">
        <thead>
        <tr>
          <th colSpan={2}>Summary for selected stations</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>Number of stations</th>
          <td className="text-right">
            {this.props.stations.length}
          </td>
        </tr>
        <tr>
          <th>Total observations</th>
          <td className="text-right">
            {totalObservationCountsForStations.toLocaleString()}
          </td>
        </tr>
        <tr>
          <th>Total climatologies</th>
          <td className="text-right">
            {totalClimatologyCountsForStations.toLocaleString()}
          </td>
        </tr>
        </tbody>
      </Table>
    )
    return (
      <p>Total observations for selected stations: {totalObservationCountsForStations}</p>
    );
  }
}

export default ObservationCounts;
