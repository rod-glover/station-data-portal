import React from 'react';
import ReactDOM from 'react-dom';
import BCMap from '../BCMap';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BCMap/>, div);
});
