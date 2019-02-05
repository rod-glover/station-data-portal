import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
    observationCounts: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.startDate !== state.prevStartDate ||
      props.endDate !== state.prevEndDate
      // props.stations !== state.prevStations
    ) {
      return {
        observationCounts: null,  // Signal need for new data
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
    if (this.state.observationCounts === null) {
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
    }).then(response => this.setState({ observationCounts: response.data }));
  }

  render() {
    const { observationCounts } = this.state;
    if (observationCounts === null) {
      return <p>Loading counts...</p>
    }

    const counts = observationCounts.observationCounts;  // Yikes. Naming.
    const totalForStations =
      reduce((sum, station) => sum + counts[station.id], 0)
        (this.props.stations);
    return (
      <p>Total observations for selected stations: {totalForStations}</p>
    );
  }
}

export default ObservationCounts;
