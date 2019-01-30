import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import { map, flow, tap } from 'lodash/fp';
import { getNetworks } from '../../../data-services/station-data-service';

import logger from '../../../logger';

import './NetworkSelector.css';

logger.configure({ active: true });

class NetworkSelector extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  state = {
    networks: null,
  };

  componentDidMount() {
    getNetworks().then(response => this.setState({ networks: response.data }))
  }

  static makeOptions = networks => (
    networks === null ?
      [] :
      flow(
        tap(networks => console.log('networks', networks)),
        map(
          network => ({
            value: network,
            label: `${network.name} — ${network.long_name}`,
            isDisabled: !network.publish,
          })
        ),
        tap(options => console.log('options', options)),
      )(networks)
  );

  render() {

    return (
      <Select
        options={NetworkSelector.makeOptions(this.state.networks)}
        placeholder={
          this.state.networks ? 'Select or type to search...' : 'Loading...'
        }
        {...this.props}
      />
    );
  }
}

export default NetworkSelector;
