import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Row, Col, Badge, Button } from 'react-bootstrap';
import clone from 'lodash/fp/clone';
import concat from 'lodash/concat';  // Note: Not FP!
import map from 'lodash/fp/map';
import slice from 'lodash/fp/slice';
import zip from 'lodash/fp/zip';

import logger from '../../../logger';

import './AdjustableColumns.css';
import { mapWithKey } from '../../../utils/fp';

logger.configure({ active: true });

export default class AdjustableColumns extends Component {
  static propTypes = {
    defaultLgs: PropTypes.array.isRequired,
    contents: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    if (props.defaultLgs.length !== props.contents.length) {
      throw new Error(
        'Number of column widths and number of columns do not match');
    }
    this.state = {
      lgs: clone(props.defaultLgs),
    }
  }

  handleExpandLeft = index => () => this.setState(state => {
    const lgs = state.lgs;
    return {
      lgs: concat(
        slice(0, index-1, lgs),
        lgs[index-1] - 1,
        lgs[index] + 1,
        slice(index+1, lgs.length, lgs),
      )
    }
  });

  handleExpandRight = index => () => this.setState(state => {
    const lgs = state.lgs;
    return {
      lgs: concat(
        slice(0, index, lgs),
        lgs[index] + 1,
        lgs[index+1] - 1,
        slice(index+2, lgs.length, lgs),
      )
    }
  });

  render() {
    const n = this.props.contents.length;
    const lgsContents = zip(this.state.lgs, this.props.contents);
    const columns = mapWithKey(([lg, content], i) =>
      <Col lg={lg}>
        <Row>
          <Col lg={12} className={'text-center'}>
              {i > 0 ?
                <Button
                  bsSize="xsmall"
                  onClick={this.handleExpandLeft(i)}
                  disabled={this.state.lgs[i-1] <= 1}
                  title={'Click to expand this column to the left'}
                >
                  {'<'}
                </Button> :
                null
              }
            <Badge>{lg}</Badge>
              {i < n-1 ?
                <Button
                  bsSize="xsmall"
                  onClick={this.handleExpandRight(i)}
                  disabled={this.state.lgs[i+1] <= 1}
                  title={'Click to expand this column to the right'}
                >
                  {'>'}
                </Button> :
                null
              }
          </Col>
        </Row>
        <Row>
          <Col lg={12}>{content}</Col>
        </Row>
      </Col>
    )(lgsContents);

    return (
      <React.Fragment>
        {
          columns
        }
      </React.Fragment>
    );
  }
}

