import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import memoize from 'memoize-one';
import { map, flow, sortBy, tap } from 'lodash/fp';

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
        sortBy('label'),
        tap(options => console.log('options', options)),
      )(networks)
  ));

  handleClickAll = () =>
    this.props.onChange(this.makeOptions(this.props.networks));

  render() {

    return (
      <div>
        <Button bsSize={'small'} onClick={this.handleClickAll}>All</Button>
        <Select
          options={this.makeOptions(this.props.networks)}
          placeholder={
            this.props.networks ? 'Select or type to search...' : 'Loading...'
          }
          {...this.props}
          isMulti
        />
      </div>
    );
  }
}

export default NetworkSelector;
