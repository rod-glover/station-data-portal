import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Row, Col, Badge, Button, ButtonGroup } from 'react-bootstrap';
import clone from 'lodash/fp/clone';
import concat from 'lodash/concat';  // Note: Not FP!
import fill from 'lodash/fp/fill';
import map from 'lodash/fp/map';
import slice from 'lodash/fp/slice';
import zipAll from 'lodash/fp/zipAll';

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
    const numColumns = this.props.defaultLgs.length;
    this.state = {
      lgHiddens: map(lg => lg === 0)(props.defaultLgs),
      lgs: clone(props.defaultLgs),
    }
  }

  handleShrinkLeftBy = amount => index => () => this.setState(state => {
    const lgHiddens = state.lgHiddens;
    const lgs = state.lgs;
    const n = lgs.length;
    const amt = Math.min(amount, lgs[index]);
    const newSelfWidth = lgs[index] - amt;
    return {
      lgHiddens: concat(
        slice(0, index-1, lgHiddens),
        false,                // Show L neighbour
        newSelfWidth === 0,   // Hide self if will be shrunk to zero width
        slice(index+1, n, lgHiddens),
      ),
      lgs: concat(
        slice(0, index-1, lgs),
        lgs[index-1] + amt,   // Expand L neighbout
        newSelfWidth,         // Shrink self
        slice(index+1, n, lgs),
      )
    }
  });

  handleShrinkRightBy = amount => index => () => this.setState(state => {
    const lgHiddens = state.lgHiddens;
    const lgs = state.lgs;
    const n = lgs.length;
    const amt = Math.min(amount, lgs[index]);
    const newSelfWidth = lgs[index] - amt;
    return {
      lgHiddens: concat(
        slice(0, index, lgHiddens),
        newSelfWidth === 0,   // Hide self if will be shrunk to zero width
        false,                // Show R neighbour
        slice(index+2, n, lgHiddens),
      ),
      lgs: concat(
        slice(0, index, lgs),
        newSelfWidth,
        lgs[index+1] + amt,
        slice(index+2, n, lgs),
      )
    }
  });

  render() {
    const n = this.props.contents.length;
    const lgsContents = zipAll([
      this.state.lgHiddens,
      this.state.lgs,
      this.props.contents
    ]);
    console.log('### render', lgsContents)
    const columns = mapWithKey(([lgHidden, lg, content], i) =>
      <Col lg={lg} lgHidden={lgHidden} style={{
        // borderLeft: i > 0 && '1px dotted #ddd',
        borderRight: i < n && '1px dotted #ddd'
      }}>
        <Row>
          <Col lg={12} className={'text-center'} style={{
            // 'marginBottom': '-1em',
            // zIndex: 99999,
          }}>
            {
              i > 0 && <ButtonGroup
                className={'pull-left'}
                style={{
                  position: 'relative', right: '1em',
                  zIndex: 99999,
                }}
              >
                {lg > 1 && <Button
                  bsSize="xsmall"
                  onClick={this.handleShrinkLeftBy(1)(i)}
                  title={`(${lg}) Click to move column boundary`}
                >
                  {'>'}
                </Button>}
                {lg > 2 && <Button
                  bsSize="xsmall"
                  onClick={this.handleShrinkLeftBy(2)(i)}
                  title={`(${lg}) Click to move column boundary`}
                >
                  {'>>'}
                </Button>}
                <Button
                  bsSize="xsmall"
                  onClick={this.handleShrinkLeftBy(lg)(i)}
                  title={`(${lg}) Click to hide column`}
                >
                  {'>!'}
                </Button>
              </ButtonGroup>
            }
            <Badge>{lg}</Badge>
            {
              i < n-1 && <ButtonGroup
                className={'pull-right'}
                style={{
                  position: 'relative', left: '1em',
                  zIndex: 99999,
                }}
              >
                <Button
                  bsSize="xsmall"
                  onClick={this.handleShrinkRightBy(lg)(i)}
                  title={`(${lg}) Click to hide column`}
                >
                  {'!<'}
                </Button>
                {lg > 2 && <Button
                  bsSize="xsmall"
                  onClick={this.handleShrinkRightBy(2)(i)}
                  title={`(${lg}) Click to move column boundary`}
                >
                  {'<<'}
                </Button>}
                {lg > 1 && <Button
                  bsSize="xsmall"
                  onClick={this.handleShrinkRightBy(1)(i)}
                  title={`(${lg}) Click to move column boundary`}
                >
                  {'<'}
                </Button>}
              </ButtonGroup>
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

