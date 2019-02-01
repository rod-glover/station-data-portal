import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import memoize from 'memoize-one';
import { map, flow, filter, sortBy, tap } from 'lodash/fp';
import chroma from 'chroma-js';
import logger from '../../../logger';
import './FrequencySelector.css';

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
];

class FrequencySelector extends Component {
  static propTypes = {
    networks: PropTypes.array,
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  handleClickAll = () => this.props.onChange(options);

  handleClickNone = () => this.props.onChange([]);

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
