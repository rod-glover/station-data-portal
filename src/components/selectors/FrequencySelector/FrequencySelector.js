import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import memoize from 'memoize-one';
import { map, flow, filter, sortBy, find, tap } from 'lodash/fp';
import chroma from 'chroma-js';
import logger from '../../../logger';
import './FrequencySelector.css';

logger.configure({ active: true });


class FrequencySelector extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onReady: () => null,
  };

  static options = [
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

  componentDidMount() {
    const actions = {
      selectAll: this.handleClickAll,
      selectNone: this.handleClickNone,
    };
    this.props.onReady(actions);
  }

  handleClickAll = () => this.props.onChange(FrequencySelector.options);

  handleClickNone = () => this.props.onChange([]);

  static valueToLabel = value => {
    const option = find({ value })(FrequencySelector.options);
    return option ? option.label : value;
  };

  render() {
    return (
      <div>
        <div><ControlLabel>Observation Frequency</ControlLabel></div>
        <Button bsSize={'small'} onClick={this.handleClickAll}>All</Button>
        <Button bsSize={'small'} onClick={this.handleClickNone}>None</Button>
        <Select
          options={FrequencySelector.options}
          {...this.props}
          isMulti
        />
      </div>
    );
  }
}

export default FrequencySelector;
