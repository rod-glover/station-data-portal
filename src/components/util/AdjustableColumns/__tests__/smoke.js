import React from 'react';
import ReactDOM from 'react-dom';
import AdjustableColumns from '../AdjustableColumns';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <AdjustableColumns
        defaultLgs={[6, 6]}
        contents={[(<div></div>), (<div></div>)]}
      />,
      div
    );
});

