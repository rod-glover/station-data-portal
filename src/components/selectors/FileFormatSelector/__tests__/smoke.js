import React from 'react';
import ReactDOM from 'react-dom';
import FileFormatSelector from '../FileFormatSelector';
import noop from 'lodash/noop';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <FileFormatSelector
        onChange={noop}
      />,
      div
    );
});

