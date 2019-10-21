import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import memoize from 'memoize-one';
import cond from 'lodash/fp/cond';
import constant from 'lodash/fp/constant';
import filter from 'lodash/fp/filter';
import find from 'lodash/fp/find';
import identity from 'lodash/fp/identity';
import isEqual from 'lodash/fp/isEqual';
import isFunction from 'lodash/fp/isFunction';
import chroma from 'chroma-js';
import logger from '../../../logger';
import './FrequencySelector.css';
import stubTrue from 'lodash/fp/stubTrue';

logger.configure({ active: true });


const options = [
  {
    label: 'Hourly',
    value: '1-hourly',
  },
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Semi-daily',
    value: '12-hourly',
  },
  {
    label: 'Irregular',
    value: 'irregular',
  },
  {
    label: 'Unspecified',
    value: '',
  },
];

class FrequencySelector extends Component {
  static propTypes = {
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
    defaultValue: 'all',
  };

  componentDidMount() {
    this.setDefault();
    const actions = {
      getAllOptions: () => options,
      selectAll: this.handleClickAll,
      selectNone: this.handleClickNone,
    };
    this.props.onReady(actions);
  }

  setDefault = () => {
    const { defaultValue, onChange } = this.props;
    const value = cond([
      [isEqual('none'), constant([])],
      [isFunction, filter],
      [stubTrue, constant(identity)],
    ])(defaultValue)(options);
    console.log('### setDefault', value)
    onChange(value);
  };

  handleClickAll = () => this.props.onChange(options);

  handleClickNone = () => this.props.onChange([]);

  static valueToLabel = value => {
    const option = find({ value })(options);
    return option ? option.label : value;
  };

  render() {
    return (
      <div>
        <div><ControlLabel>Observation Frequency</ControlLabel></div>
        <Button bsSize={'small'} onClick={this.handleClickAll}>All</Button>
        <Button bsSize={'small'} onClick={this.handleClickNone}>None</Button>
        <Select
          options={options}
          {...this.props}
          isMulti
        />
      </div>
    );
  }
}

export default FrequencySelector;
