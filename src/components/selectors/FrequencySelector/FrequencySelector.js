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
import LocalPropTypes from '../../local-prop-types';
import capitalize from 'lodash/fp/capitalize';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';
import map from 'lodash/fp/map';
import tap from 'lodash/fp/tap';
import sortBy from 'lodash/fp/sortBy';
import uniqBy from 'lodash/fp/uniqBy';

import css from '../common.module.css';

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

const freqToLabel = freq => {
  const labels = {
    '1-hourly': 'Hourly',
    '12-hourly': 'Semi-daily'
  };
  return get(freq, labels) || capitalize(freq) || 'Unspecified';
};

class FrequencySelector extends Component {
  static propTypes = {
    allHistories: PropTypes.array.isRequired,
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
      getAllOptions: this.getOptions,
      selectAll: this.handleClickAll,
      selectNone: this.handleClickNone,
    };
    this.props.onReady(actions);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.allHistories !== prevProps.allHistories) {
      this.setDefault();
    }
  }

  setDefault = () => {
    this.props.onChange(
      defaultValue(this.props.defaultValueSelector, this.getOptions())
    );
  };

  makeOptions = memoize(allHistories => (
    allHistories === null ?
      [] :
      flow(
        tap(v => console.log('### freq allHistories', v)),
        uniqBy('freq'),
        tap(v => console.log('### freq uniq', v)),
        map(history => ({
          value: history.freq,
          label: freqToLabel(history.freq),
        })),
        sortBy('label'),
        tap(v => console.log('### freq options', v)),
      )(allHistories)
  ));

  getOptions = () => this.makeOptions(this.props.allHistories);

  handleClickAll = () => this.props.onChange(this.getOptions());

  handleClickNone = () => this.props.onChange([]);

  // TODO: Fix this
  static valueToLabel = value => {
    const option = find({ value })(options);
    return option ? option.label : value;
  };

  render() {
    return (
      <FormGroup>
        <div><ControlLabel>Observation Frequency</ControlLabel></div>
        <ButtonToolbar className={css.selectorButtons}>
          <Button bsSize={'xsmall'} onClick={this.handleClickAll}>All</Button>
          <Button bsSize={'xsmall'} onClick={this.handleClickNone}>None</Button>
        </ButtonToolbar>
        <Select
          options={this.getOptions()}
          placeholder={
            this.props.allHistories ? 'Select or type to search...' : 'Loading...'
          }
          {...this.props}
          isMulti
        />
      </FormGroup>
    );
  }
}

export default FrequencySelector;
