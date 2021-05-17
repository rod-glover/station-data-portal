import React from 'react';
import ReactDOM from 'react-dom';
import SimpleGeoJSON from '../SimpleGeoJSON';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <SimpleGeoJSON/>,
    div
  );
});
