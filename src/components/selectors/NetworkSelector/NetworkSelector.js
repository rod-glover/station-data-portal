import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import memoize from 'memoize-one';
import { map, flow, filter, sortBy, toPairs, fromPairs, identity, assign, compose, tap } from 'lodash/fp';
import { composeWithRestArgs } from '../../../utils/fp'
import chroma from 'chroma-js';
import logger from '../../../logger';
import './NetworkSelector.css';

logger.configure({ active: true });


class NetworkSelector extends Component {
  static propTypes = {
    allNetworks: PropTypes.array.isRequired,
    onReady: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onReady: () => null,
  };

  componentDidMount() {
    const actions = {
      getAllOptions: this.getOptions,
      selectAll: this.handleClickAll,
      selectNone: this.handleClickNone,
    };
    this.props.onReady(actions);
  }

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

  static localStyles = {
    option: (styles, { value, isDisabled }) => {
      const color = chroma(value.color || '#000000');
      return {
        ...styles,
        backgroundColor: isDisabled ? null : color.alpha(0.5).css(),
        borderBottom: '1px solid #aaa',
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

  getOptions = () => this.makeOptions(this.props.allNetworks);

  handleClickAll = () =>
    this.props.onChange(
      filter(option => !option.isDisabled)(this.getOptions())
    );

  handleClickNone = () => this.props.onChange([]);

  render() {
    const { styles } = this.props;
    const composedStyles = assign(
      styles,
      flow(
        toPairs,
        map(([name, style]) => ([
          name, composeWithRestArgs(style, styles[name] || identity)
        ])),
        fromPairs
      )(NetworkSelector.localStyles)
    );

    return (
      <div>
        <div><ControlLabel>Network</ControlLabel></div>
        <Button bsSize={'small'} onClick={this.handleClickAll}>All</Button>
        <Button bsSize={'small'} onClick={this.handleClickNone}>None</Button>
        <Select
          options={this.getOptions()}
          placeholder={
            this.props.allNetworks ? 'Select or type to search...' : 'Loading...'
          }
          {...this.props}
          styles={composedStyles}
          isMulti
        />
      </div>
    );
  }
}

export default NetworkSelector;
