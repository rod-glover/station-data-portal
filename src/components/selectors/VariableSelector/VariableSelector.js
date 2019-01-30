import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import memoize from 'memoize-one';
import {
  map,
  filter,
  some,
  pick,
  includes,
  sortBy,
  flow,
  tap
} from 'lodash/fp';
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

  static variableType = contexts => {
    const types = [
      {
        condition: some(context =>
          includes('temperature', context.short_name) &&
          !includes('dew_point', context.short_name)
        ),
        value: {
          label: 'Temperature',
          code: 'temperature'
        },
      },
      {
        condition: some(context =>
          includes('precipitation', context.short_name) ||
          includes('rain', context.short_name) ||
          includes('snow', context.short_name)
        ),
        value: {
          label: 'Precipitation',
          code: 'precipitation',
        },
      },
      {
        condition: some(context =>
          includes('humidity', context.short_name) ||
          includes('dew_point', context.short_name)
        ),
        value: {
          label: 'Humidity',
          code: 'humidity',
        },
      },
      {
        condition: some(context =>
          includes('wind', context.short_name)
        ),
        value: {
          label: 'Wind',
          code: 'wind',
        },
      },
      {
        condition: () => true,
        value: {
          label: 'Miscellaneous',
          code: 'misc',
        },
      },
    ];

    for (const [order, type] of types.entries()) {
      if (type.condition(contexts)) {
        return {
          ...type.value,
          order,
        };
      }
    }

    // Just in case I'm dumber than I think I am.
    return {
      label: 'Programmer Fail',
      type: 'fail',
      order: 999,
    };
  };

  // This function must be an instance property to be memoized correctly.
  makeOptions = memoize(variables => (
    variables === null ?
      [] :
      flow(
        tap(variables => console.log('variables', variables)),

        // Create one option per unique variable display_name.
        map(variable => ({
          context: variable,
          value: variable.display_name,
        })),
        groupByGeneral(({ value }) => value),
        map(group => ({
          contexts: map(item => item.context)(group.items),
          value: group.by,
          label: group.by,
        })),
        sortBy('label'),
        tap(options => console.log('ungrouped options', options)),

        // Group options by variable type: temp, precip, humidity, wind, misc.
        groupByGeneral(({ contexts }) => (
          VariableSelector.variableType(contexts)
        )),

        // Create from the grouped options a grouped options object that
        // React Select can consume.
        map(group => ({
          ...group.by,
          options: group.items,
        })),
        sortBy('order'),

        tap(options => console.log('grouped options', options)),
      )(variables)
  ));

  render() {
    return (
      <Select
        options={this.makeOptions(this.props.variables)}
        placeholder={
          this.props.variables ? 'Select or type to search...' : 'Loading...'
        }
        {...this.props}
      />
    );
  }
}

export default VariableSelector;
