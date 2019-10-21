import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import memoize from 'memoize-one';
import map from 'lodash/fp/map';
import flow from 'lodash/fp/flow';
import filter from 'lodash/fp/filter';
import sortBy from 'lodash/fp/sortBy';
import toPairs from 'lodash/fp/toPairs';
import fromPairs from 'lodash/fp/fromPairs';
import identity from 'lodash/fp/identity';
import assign from 'lodash/fp/assign';
import tap from 'lodash/fp/tap';
import cond from 'lodash/fp/cond';
import isEqual from 'lodash/fp/isEqual';
import constant from 'lodash/fp/constant';
import isFunction from 'lodash/fp/isFunction';
import stubTrue from 'lodash/fp/stubTrue';

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
    defaultValue: PropTypes.oneOfType([
      PropTypes.oneOf(['all', 'none']),
      PropTypes.func,
    ]),
  };

  static defaultProps = {
    onReady: () => null,
  };

  componentDidMount() {
    this.setDefault();
    const actions = {
      getAllOptions: this.getOptions,
      selectAll: this.handleClickAll,
      selectNone: this.handleClickNone,
    };
    this.props.onReady(actions);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.allNetworks !== prevProps.allNetworks) {
      this.setDefault();
    }
  }

  setDefault = () => {
    const { defaultValue, onChange } = this.props;
    const value = cond([
      [isEqual('none'), constant([])],
      [isFunction, filter],
      [stubTrue, constant(identity)],
    ])(defaultValue)(this.getOptions());
    console.log('### NS.setDefault', value)
    onChange(value);
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
