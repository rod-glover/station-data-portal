import React from 'react';
import ReactDOM from 'react-dom';
import OnlyWithClimatologyControl from '../OnlyWithClimatologyControl';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<OnlyWithClimatologyControl/>, div);
});

