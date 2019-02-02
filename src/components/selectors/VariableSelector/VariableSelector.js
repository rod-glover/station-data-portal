import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import memoize from 'memoize-one';
import {
  map,
  filter,
  flatten,
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
    allVariables: PropTypes.array,
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
  makeOptions = memoize(allVariables => (
    allVariables === null ?
      [] :
      flow(
        tap(allVariables => console.log('allVariables', allVariables)),

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
        tap(options => console.log('ungrouped variable options', options)),

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

        tap(options => console.log('grouped variable options', options)),
      )(allVariables)
  ));

  handleClickAll = () =>
    this.props.onChange(
      flow(
        map(group => group.options),
        flatten,
        filter(option => !option.isDisabled),
      )(this.makeOptions(this.props.allVariables))
    );

  makeHandleClickGroup = group =>
    (() => this.props.onChange(group.options));

  handleClickNone = () => this.props.onChange([]);

  render() {
    const options = this.makeOptions(this.props.allVariables);
    return (
      <div>
        <div><ControlLabel>Variable</ControlLabel></div>
        <Button bsSize={'small'} onClick={this.handleClickAll}>All</Button>
        {
          map(group => (
            <Button
              key={group.label}
              bsSize={'small'}
              onClick={this.makeHandleClickGroup(group)}
            >
              {`All ${group.label}`}
            </Button>
          ))(options)
        }
        <Button bsSize={'small'} onClick={this.handleClickNone}>None</Button>
        <Select
          options={options}
          placeholder={
            this.props.allVariables ? 'Select or type to search...' : 'Loading...'
          }
          {...this.props}
          isMulti
        />
      </div>
    );
  }
}

export default VariableSelector;
