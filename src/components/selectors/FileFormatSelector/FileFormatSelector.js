import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';

import logger from '../../../logger';

import './FileFormatSelector.css';
import { ControlLabel } from 'react-bootstrap';

logger.configure({ active: true });

const options = [
  {
    label: 'NetCDF',
    value: 'nc',
  },
  {
    label: 'CSV/ASCII',
    value: 'csv',
  },
  {
    label: 'MS Excel 2010',
    value: 'xslx',
  },
];

export default class FileFormatSelector extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {};

  componentDidMount() {
    this.props.onChange(options[0])
  }

  render() {
    return (
      <React.Fragment>
        <div><ControlLabel>Output format</ControlLabel></div>
        <Select
          options={options}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </React.Fragment>
    );
  }
}
