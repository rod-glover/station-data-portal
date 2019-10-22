import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup
} from 'react-bootstrap';
import Select from 'react-select';
import memoize from 'memoize-one';
import find from 'lodash/fp/find';
import { defaultValue } from '../common';
import logger from '../../../logger';
import './FrequencySelector.css';
import LocalPropTypes from '../../local-prop-types';

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
    defaultValueSelector: LocalPropTypes.defaultValueSelector,
  };

  static defaultProps = {
    onReady: () => null,
    defaultValueSelector: 'all',
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
    this.props.onChange(
      defaultValue(this.props.defaultValueSelector, options)
    );
  };

  handleClickAll = () => this.props.onChange(options);

  handleClickNone = () => this.props.onChange([]);

  static valueToLabel = value => {
    const option = find({ value })(options);
    return option ? option.label : value;
  };

  render() {
    return (
      <FormGroup>
        <div><ControlLabel>Observation Frequency</ControlLabel></div>
        <ButtonToolbar>
        <Button bsSize={'xsmall'} onClick={this.handleClickAll}>All</Button>
        <Button bsSize={'xsmall'} onClick={this.handleClickNone}>None</Button>
        </ButtonToolbar>
        <Select
          options={options}
          {...this.props}
          isMulti
        />
      </FormGroup>
    );
  }
}

export default FrequencySelector;
