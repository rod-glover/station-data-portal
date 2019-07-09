import PropTypes from 'prop-types';
import React, { Component } from 'react';

import logger from '../../logger';

import './Template.css';

logger.configure({ active: true });

export default class Template extends Component {
  static propTypes = {
  };

  state = {};

  render() {
    return (
      <div>Template</div>
    );
  }
}

