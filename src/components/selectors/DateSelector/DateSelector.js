import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ControlLabel } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import logger from '../../../logger';

import './DateSelector.css';

logger.configure({ active: true });

class DateSelector extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange:PropTypes.func.isRequired,
    label: PropTypes.string,
  };

  render() {
    return (
      <React.Fragment>
        <ControlLabel>{this.props.label}{' '}</ControlLabel>
        <DatePicker
          selected={this.props.value}
          onChange={this.props.onChange}
          dateFormat={'yyyy-MM-dd'}
          isClearable
        />
      </React.Fragment>
    );
  }
}

export default DateSelector;
