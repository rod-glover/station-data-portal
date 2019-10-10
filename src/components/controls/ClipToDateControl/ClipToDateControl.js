import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './ClipToDateControl.css';
import { Checkbox, ControlLabel } from 'react-bootstrap';

export default class ClipToDateControl extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { value, ...rest } = this.props;
    return (
      <Checkbox checked={value} {...rest}>
        <ControlLabel>Clip time series to filter date range</ControlLabel>
      </Checkbox>
    );
  }
}

