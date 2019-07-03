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
    value: 'netcdf',
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

class FileFormatSelector extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {};

  render() {
    return (
      <React.Fragment>
        <div><ControlLabel>Output format</ControlLabel></div>
        <Select
          options={options}
          defaultValue={options[0]}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </React.Fragment>
    );
  }
}

export default FileFormatSelector;
