import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import memoize from 'memoize-one';
import { map, flow, tap } from 'lodash/fp';

import logger from '../../../logger';

import './NetworkSelector.css';

logger.configure({ active: true });

class NetworkSelector extends Component {
  static propTypes = {
    networks: PropTypes.array,
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  // This function must be an instance property to be memoized correctly.
  makeOptions = memoize(networks => (
    networks === null ?
      [] :
      flow(
        tap(networks => console.log('networks', networks)),
        map(
          network => ({
            value: network,
            label: `${network.name} – ${network.long_name}`,
            isDisabled: !network.publish,
          })
        ),
        tap(options => console.log('options', options)),
      )(networks)
  ));

  render() {

    return (
      <Select
        options={this.makeOptions(this.props.networks)}
        placeholder={
          this.props.networks ? 'Select or type to search...' : 'Loading...'
        }
        {...this.props}
      />
    );
  }
}

export default NetworkSelector;
