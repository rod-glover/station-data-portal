import React from 'react';
import ReactDOM from 'react-dom';
import DateSelector from '../DateSelector';
import noop from 'lodash/noop';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <DateSelector onChange={noop} label={"Test"}/>,
      div
    );
});

