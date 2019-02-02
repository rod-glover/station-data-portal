import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import memoize from 'memoize-one';
import { map, flow, filter, sortBy, tap } from 'lodash/fp';
import chroma from 'chroma-js';
import logger from '../../../logger';
import './NetworkSelector.css';

logger.configure({ active: true });


class NetworkSelector extends Component {
  static propTypes = {
    allNetworks: PropTypes.array,
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  // This function must be an instance property to be memoized correctly.
  makeOptions = memoize(allNetworks => (
    allNetworks === null ?
      [] :
      flow(
        tap(allNetworks => console.log('allNetworks', allNetworks)),
        map(
          network => ({
            value: network,
            label: `${network.name} – ${network.long_name}`,
            isDisabled: !network.publish,
          })
        ),
        sortBy('label'),
        tap(options => console.log('options', options)),
      )(allNetworks)
  ));

  static styles = {
    option: (styles, { value, isDisabled }) => {
      const color = chroma(value.color || '#000000');
      return {
        ...styles,
        backgroundColor: isDisabled ? null : color.alpha(0.5).css(),
      };
    },
    multiValue: (styles, { data: { value, isDisabled } }) => {
      const color = chroma(value.color || '#000000');
      return {
        ...styles,
        backgroundColor: isDisabled ? null : color.alpha(0.5).css(),
      };
    },
  };

  handleClickAll = () =>
    this.props.onChange(
      filter(option => !option.isDisabled)
        (this.makeOptions(this.props.allNetworks))
    );

  handleClickNone = () => this.props.onChange([]);

  render() {
    return (
      <div>
        <div><ControlLabel>Network</ControlLabel></div>
        <Button bsSize={'small'} onClick={this.handleClickAll}>All</Button>
        <Button bsSize={'small'} onClick={this.handleClickNone}>None</Button>
        <Select
          options={this.makeOptions(this.props.allNetworks)}
          styles={NetworkSelector.styles}
          placeholder={
            this.props.allNetworks ? 'Select or type to search...' : 'Loading...'
          }
          {...this.props}
          isMulti
        />
      </div>
    );
  }
}

export default NetworkSelector;
