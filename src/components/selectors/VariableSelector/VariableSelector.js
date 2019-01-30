import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import { map, filter, pick, includes, sortBy, flow, tap } from 'lodash/fp';
import { groupByGeneral } from '../../../utils/fp';

import logger from '../../../logger';

import './VariableSelector.css';

logger.configure({ active: true });


// TODO: Update pcic-react-components GroupingSelector to communicate options
// and reuse here? Right now there is a lot of repetition of function.
class VariableSelector extends Component {
  static propTypes = {
    variables: PropTypes.array,
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  static variableType = variable => {
    if (
      includes('temperature', variable.short_name) &&
      !includes('dew_point', variable.short_name)
    ) {
      return {
        type: 'temperature',
        label: 'Temperature',
        order: 1,
      };
    }
    if (
      includes('precipitation', variable.short_name) ||
      includes('rain', variable.short_name) ||
      includes('snow', variable.short_name)
    ) {
      return {
        type: 'precipitation',
        label: 'Precipitation',
        order: 2,
      };
    }
    if (
      includes('humidity', variable.short_name) ||
      includes('dew_point', variable.short_name)
    ) {
      return {
        type: 'humidity',
        label: 'Humidity',
        order: 3,
      };
    }
    if (includes('wind', variable.short_name)) {
      return {
        type: 'wind',
        label: 'Wind',
        order: 4,
      };
    }
    return {
      type: 'other',
      label: 'Miscellaneous',
      order: 5,
    };
  };

  static makeOptions = variables => (
    variables === null ?
      [] :
      flow(
        tap(variables => console.log('variables', variables)),

        // Create one option per unique variable display_name.
        map(variable => ({
          context: variable,
          value: pick(['display_name', 'short_name'], variable),
        })),
        groupByGeneral(({ value }) => value),
        map(group => ({
          contexts: map(item => item.context)(group.items),
          value: group.by,
          label: group.by.display_name,
        })),
        sortBy('label'),
        tap(options => console.log('ungrouped options', options)),

        // Group options by variable type: temp, precip, humidity, wind, misc.
        groupByGeneral(({ value }) => (
          VariableSelector.variableType(value)
        )),
        map(group => ({
          ...group.by,
          options: group.items,
        })),
        sortBy('order'),

        tap(options => console.log('grouped options', options)),
      )(variables)
  );

  render() {

    return (
      <Select
        options={VariableSelector.makeOptions(this.props.variables)}
        placeholder={
          this.props.variables ? 'Select or type to search...' : 'Loading...'
        }
        {...this.props}
      />
    );
  }
}

export default VariableSelector;
